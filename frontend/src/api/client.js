import axios from 'axios'

// Fall back to the local backend if the env var isn't loaded (e.g. the Vite
// dev server was started before .env existed).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
})

export async function orchestrate(payload) {
  const response = await api.post('/orchestrate', payload)
  return response.data
}

export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}
