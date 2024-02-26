import request from 'supertest';
import app from '../../src/app'; 
import authMiddleware from '../../src/middlewares/userMiddleware'
import userModel from '../../src/models/user';
import jwt from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  let jwtToken: string;

  beforeAll(async () => {
    // Set up a test user in the database and obtain a valid JWT token for testing
    const user = await userModel.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword',
      number: '1234567890',
    });

    jwtToken = jwt.sign({ email: user.email }, process.env.SECRET_KEY as string, { expiresIn: '30d' });
  });

  afterAll(async () => {
    // Clean up test data, e.g., delete the test user
    await userModel.deleteMany({});
  });

  describe('signUpValidation Middleware', () => {
    it('should pass validation for valid input', async () => {
      const response = await request(app)
        .post('/user/signUp')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'Password123',
          number: '9876543210',
        });

      expect(response.status).toBe(201);
    });

    // Add more test cases for invalid input, edge cases, etc.
  });

  describe('loginValidation Middleware', () => {
    it('should pass validation for valid input', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(response.status).toBe(200);
    });

    // Add more test cases for invalid input, edge cases, etc.
  });

  describe('authMiddleware', () => {
    it('should pass authentication with a valid token', async () => {
      const response = await request(app)
        .get('/protected-route') // Replace with the actual protected route
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ /* expected response structure */ }));
    });

    it('should handle missing token', async () => {
      const response = await request(app)
        .get('/protected-route') // Replace with the actual protected route
        .set('Authorization', 'Bearer');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Token not Provided' });
    });

    // Add more test cases for invalid tokens, expired tokens, etc.
  });
});
