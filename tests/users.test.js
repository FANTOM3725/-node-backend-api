import request from "supertest";
import {describe, it, expect} from "vitest"
import {app} from "../app.js";

describe('Protected Api', ()=> {

    it('Protected Api without token', async () => {
        const responce = await request(app)
            .get('/api/users/id')
        expect(responce.status).toBe(401)
    })
})