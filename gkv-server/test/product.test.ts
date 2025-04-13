import request from 'supertest'
import app from '../index'

describe('GET /api/products', () => {
  it('should return 200 and an array', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
