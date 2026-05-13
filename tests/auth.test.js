import { describe, expect, it, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

 let adminToken
 let userToken
 let userId

beforeAll(async () => {
    const userLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'john.email@email.com',
            password: '12345678'
        })

    userToken = userLoginResponse.body.accessToken

    const decodedUser = jwt.verify(userToken, JWT_SECRET)
    userId = decodedUser.id
})

beforeAll(async () => {
    const adminLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@gmail.com',
            password: '123456789'
        })

    adminToken = adminLoginResponse.body.accessToken
})

describe('Auth API', () => {
    it('post invalid body for /api/auth/register', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: '',
                password: ''
            })

        expect(response.status).toBe(400)
    })

    it('invalid Body for /api/auth/login', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: '',
                password: ''
            })

        expect(response.status).toBe(400)
    })

    it('Protected API with an authorization role', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(403)
    })

    it('Getting access to a profile with a different id', async () => {
        const response = await request(app)
            .get('/api/users/888')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(403)
    })

    it('Getting access to a profile with id', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(200)
    })

    it('getting access to API protected with role admin with admin account', async () => {
        const response = await request(app)
            .get('/api/auth/admin-panel')
            .set('Authorization', `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
    })

    it('Getting access to admin Api with user account', async () => {
        const response = await request(app)
            .get('/api/auth/admin-panel')
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(403)
    })


    it('create product with admin account', async () => {
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'test',
                price: 100
            })
        expect(response.status).toBe(201)
    })
})

describe('Auth refresh/logout with cookies', () => {
    it('should refresh access token using cookie', async () => {
        const agent = request.agent(app)

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                email: 'john.email@email.com',
                password: '12345678'
            })


        const refreshResponse = await agent
            .post('/api/auth/refresh')


        expect(refreshResponse.status).toBe(200)
        expect(refreshResponse.body).toHaveProperty('accessToken')
    })

    it('should logout using cookie', async () => {
        const agent = request.agent(app)

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                email: 'john.email@email.com',
                password: '12345678'
            })


        const logoutResponse = await agent
            .post('/api/auth/logout')


        expect(logoutResponse.status).toBe(200)
        expect(logoutResponse.body.message).toBe('Выход выполнен')
    })

    it('should not refresh after logout', async () => {
        const agent = request.agent(app)

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                email: 'john.email@email.com',
                password: '12345678'
            })


        const logoutResponse = await agent
            .post('/api/auth/logout')


        expect(logoutResponse.status).toBe(200)

        const refreshResponse = await agent
            .post('/api/auth/refresh')


        expect(refreshResponse.status).toBe(401)
    })
})