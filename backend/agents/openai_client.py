"""Shared async OpenAI client and a resilient JSON-returning call_llm helper."""

from __future__ import annotations

import json
import logging
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

logger = logging.getLogger(__name__)

MODEL = "gpt-4o"
TEMPERATURE = 0.3
_RETRY_INSTRUCTION = "Return ONLY valid JSON, no other text"

# Single reusable client instance shared across all agents.
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def _complete(system_prompt: str, user_prompt: str) -> str:
    """Run one chat completion and return the raw message content."""
    response = await client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content or ""


async def call_llm(system_prompt: str, user_prompt: str) -> dict:
    """Call gpt-4o expecting a JSON object response and return it as a dict.

    Retries once with a stricter instruction if the first response is not
    valid JSON. Never raises: any failure resolves to {"error": ...}.
    """
    # First attempt.
    try:
        content = await _complete(system_prompt, user_prompt)
        return json.loads(content)
    except json.JSONDecodeError:
        logger.warning("call_llm: first response was not valid JSON; retrying once")
    except Exception:  # network errors, auth, rate limits, etc.
        logger.exception("call_llm: request failed")
        return {"error": "request_failed"}

    # Retry once with an appended instruction to return only JSON.
    try:
        retry_system = f"{system_prompt}\n\n{_RETRY_INSTRUCTION}"
        content = await _complete(retry_system, user_prompt)
        return json.loads(content)
    except json.JSONDecodeError:
        logger.warning("call_llm: retry response was still not valid JSON")
        return {"error": "parse_failed"}
    except Exception:
        logger.exception("call_llm: retry request failed")
        return {"error": "request_failed"}
