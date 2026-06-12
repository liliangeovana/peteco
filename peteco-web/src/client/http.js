import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

http.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem('peteco_usuario')
    if (stored) {
      const user = JSON.parse(stored)
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch { /* ignora */ }
  return config
})
