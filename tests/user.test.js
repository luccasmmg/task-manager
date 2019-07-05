const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Email',
      email: 'andrew@example.com',
      password: 'MyPass777!'
    })
    .expect(201);
});

test('Should login Mike', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  //Asert that the token matches the one in the database
  const user = await User.findById(response.body.user._id);
  expect(user.tokens[1].token)
    .toBe(response.body.token);
});

test('Should update Mike to Luccas', async () => {
  const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          name: "Luccas"
        })
        .expect(200);
  //Asert that the token matches the one in the database
  const user = await User.findById(userOneId);
  expect(user.name)
    .toBe("Luccas");
});

test('Should not update location', async () => {
  const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          location: "Parnamirim"
        })
        .expect(400);
});

test('Should not login Mike', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'MyPass776!'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete profile for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user)
    .toBeNull();
});

test('Should not delete profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});
