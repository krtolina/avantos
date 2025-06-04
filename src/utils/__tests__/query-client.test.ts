import { describe, it, expect } from 'vitest'
import { queryClient } from '../query-client'

describe('queryClient', () => {
  it('should be an instance of QueryClient', () => {
    expect(queryClient).toHaveProperty('getQueryCache')
  })

  it('should have default staleTime set to 5 minutes', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000)
  })
})
