import { describe, it, expect } from 'vitest'

import { axiosInstance } from '../axios'
import { CONFIG } from '../../config-global'

describe('Axios Configuration', () => {
  it('should create axios instance with correct base URL', () => {
    expect(axiosInstance.defaults.baseURL).toBe(CONFIG.serverUrl)
  })
})

describe('Axios Interceptors', () => {
  it('should handle errors', async () => {
    try {
      await axiosInstance.get('/test-error')
    } catch (error) {
      expect((error as any).response.status).toBe(404)
    }
  })
})
