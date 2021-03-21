const request = require('supertest');
const server = require('../api/server');
const users = require('../user/userModel');

describe('Auth router', function() {
    test('should run the test', function() {
        expect(true).toBe(true);
    })

    describe('POST /api/auth/', () => {
        test('/register should return 201 with user and token', async () => {
            const username = 'testuserauth';
            const res = await request(server)
                .post('/api/auth/register')
                .send({ username: username, password: "youbreath" });
            const id = res.body.user.id;
            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
            user: expect.objectContaining({
                id: expect.any(Number),
                username: expect.stringMatching(username),
                password: expect.any(String)
            }),
            token: expect.any(String),
            });
            //delete the newly registered user
            await users.remove(id);
        });

        test('/login should return a 200 with a message and token', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ username: 'showmethemoney', password: 'showmethemoney' });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                message: expect.stringMatching('Welcome back, showmethemoney'),
                token: expect.any(String)
            });
        });
    });
});