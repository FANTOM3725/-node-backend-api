import { describe, expect, it, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'

let adminToken
let userToken
let createdOrderId

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

    const createOrderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)

    expect(createOrderResponse.status).toBe(201)
    expect(createOrderResponse.body).toHaveProperty('order')

    createdOrderId = createOrderResponse.body.order.id
})

describe('Orders API', () => {
    it('should create order with user account', async () => {
        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('order')
        expect(response.body.order).toHaveProperty('id')
        expect(response.body.order).toHaveProperty('userId')
    })

    it('should return user orders', async () => {
        const response = await request(app)
            .get('/api/orders/my')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('orders')
        expect(Array.isArray(response.body.orders)).toBe(true)
        expect(response.body.orders.length).toBeGreaterThan(0)
    })

    it('should return user order by id', async () => {
        const response = await request(app)
            .get(`/api/orders/my/${createdOrderId}`)
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('order')
        expect(response.body.order.id).toBe(createdOrderId)
    })

    it('should deny user access to all orders route', async () => {
        const response = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(403)
    })

    it('should return all orders for admin', async () => {
        const response = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('orders')
        expect(Array.isArray(response.body.orders)).toBe(true)
        expect(response.body.orders.length).toBeGreaterThan(0)
    })

    it('should return order by id for admin', async () => {
        const response = await request(app)
            .get(`/api/orders/${createdOrderId}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('order')
        expect(response.body.order.id).toBe(createdOrderId)
    })

    it('should deny user access to update order status', async () => {
        const response = await request(app)
            .patch(`/api/orders/${createdOrderId}/status`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                status: 'shipped'
            })

        expect(response.status).toBe(403)
    })

    it('should update order status with admin account', async () => {
        const response = await request(app)
            .patch(`/api/orders/${createdOrderId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                status: 'shipped'
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('order')
        expect(response.body.order.status).toBe('shipped')
    })

    it('should return 400 for invalid order id', async () => {
        const response = await request(app)
            .get('/api/orders/abc')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(400)
    })

    it('should return 404 for missing order', async () => {
        const response = await request(app)
            .get('/api/orders/999999')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(404)
    })
})