import { describe, expect, it, beforeAll } from 'vitest'
import request from 'supertest'
import path from 'path'
import { app } from '../app.js'

let adminToken
let userToken
let createdProductId

beforeAll(async () => {
    const userLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'john.email@email.com',
            password: '12345678'
        })

    expect(userLoginResponse.status).toBe(200)
    expect(userLoginResponse.body).toHaveProperty('accessToken')

    userToken = userLoginResponse.body.accessToken

    const adminLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@gmail.com',
            password: '123456789'
        })

    expect(adminLoginResponse.status).toBe(200)
    expect(adminLoginResponse.body).toHaveProperty('accessToken')

    adminToken = adminLoginResponse.body.accessToken

    const createProductResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Test Product',
            price: 999
        })

    expect(createProductResponse.status).toBe(201)
    expect(createProductResponse.body).toHaveProperty('product')

    createdProductId = createProductResponse.body.product.id
})

describe('Products API', () => {
    it('Getting access to admin Api with user account', async () => {
        const response = await request(app)
            .get('/api/auth/admin-panel')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(403)
    })

    it('should allow admin access to admin products route', async () => {
        const response = await request(app)
            .get('/api/auth/admin-panel')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
    })

    it('should upload image for product', async () => {
        const filePath = path.resolve('tests/fixtures/product.png')

        const response = await request(app)
            .post(`/api/products/${createdProductId}/image`)
            .set('Authorization', `Bearer ${adminToken}`)
            .attach('image', filePath)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('product')
        expect(response.body.product).toHaveProperty('imageUrl')
        expect(typeof response.body.product.imageUrl).toBe('string')
    })

    it('should delete image for product', async () => {
        const filePath = path.resolve('tests/fixtures/product.png')

        const uploadResponse = await request(app)
            .post(`/api/products/${createdProductId}/image`)
            .set('Authorization', `Bearer ${adminToken}`)
            .attach('image', filePath)

        expect(uploadResponse.status).toBe(200)
        expect(uploadResponse.body.product.imageUrl).toBeTruthy()

        const response = await request(app)
            .delete(`/api/products/${createdProductId}/image`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('product')
        expect(response.body.product.imageUrl).toBe(null)
    })

    it('should soft delete product', async () => {
        const response = await request(app)
            .delete(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
    })

    it('should not return deleted product by id', async () => {
        const response = await request(app)
            .get(`/api/products/${createdProductId}`)

        expect(response.status).toBe(404)
    })

    it('should restore product', async () => {
        const response = await request(app)
            .patch(`/api/products/${createdProductId}/restore`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('product')
        expect(response.body.product.id).toBe(createdProductId)
    })

    it('should return restored product by id', async () => {
        const response = await request(app)
            .get(`/api/products/${createdProductId}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('product')
        expect(response.body.product.id).toBe(createdProductId)
    })
})

