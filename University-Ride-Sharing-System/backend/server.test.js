const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = require('./server'); // Adjust if your server export is different

// Use a test database
const MONGO_TEST_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/university-ride-sharing-test';

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('POST /api/register', () => {
  const validUser = {
    name: 'Test User',
    studentId: 'S123',
    email: 'test@uohyd.ac.in',
    password: 'password123',
    profilePicture: 'data:image/png;base64,abc',
  };

  it('should register a new user (normal flow)', async () => {
    const res = await request(app).post('/api/register').send(validUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('should reject non-university email', async () => {
    const res = await request(app).post('/api/register').send({ ...validUser, email: 'test@gmail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/only university email addresses/i);
  });

  it('should reject existing email', async () => {
    await request(app).post('/api/register').send(validUser); // Register once
    const res = await request(app).post('/api/register').send(validUser); // Try again
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should reject missing required fields', async () => {
    const res = await request(app).post('/api/register').send({ email: 'missing@uohyd.ac.in' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields are required/i);
  });
});
