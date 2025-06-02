import axios from 'axios'
import { CONFIG } from '../config-global'

export const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)
