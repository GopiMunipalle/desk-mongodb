import request from 'supertest';
import app from '../../src/app';
import userModel from '../../src/models/user';
import bcrypt from 'bcrypt';

// describe('User Controller', () => {
//   beforeAll(async () => {
//     const hashedPassword = await bcrypt.hash('testPassword', 10);
//     await userModel.create({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: hashedPassword,
//       number: '1234567890',
//     });
//   });

//   afterAll(async () => {
//     await userModel.deleteMany({});
//   });

//   describe('signUp API', () => {
//     it('should create a new user successfully', async () => {
//       const response = await request(app)
//         .post('/user/signUp')
//         .send({
//           name: 'John Doe',
//           email: 'john.doe@example.com',
//           password: 'Password123',
//           number: '9876543210',
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({ message: 'User Created Successfully' });
//     });

//     it('should handle user already exists case', async () => {
//       const response = await request(app)
//         .post('/user/signUp')
//         .send({
//           name: 'Test User',
//           email: 'test@example.com',
//           password: 'Password456',
//           number: '1234567890',
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'User Exists Already' });
//     });

//     // Add more test cases for invalid input, edge cases, etc.
//   });

//   describe('login API', () => {
//     it('should login with correct credentials', async () => {
//       const response = await request(app)
//         .post('/user/login')
//         .send({
//           email: 'test@example.com',
//           password: 'testPassword',
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('jwtToken');
//     });

//     it('should handle user not found case', async () => {
//       const response = await request(app)
//         .post('/user/login')
//         .send({
//           email: 'nonexistent@example.com',
//           password: 'somePassword',
//         });

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({ error: 'User not found' });
//     });

//     it('should handle incorrect password case', async () => {
//       const response = await request(app)
//         .post('/user/login')
//         .send({
//           email: 'test@example.com',
//           password: 'wrongPassword',
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({ error: 'Incorrect Password' });
//     });

//     // Add more test cases for invalid input, edge cases, etc.
//   });
// });

describe('User controller',()=>{
  beforeAll(async()=>{
    const hashedPassword=await bcrypt.hash('gopi',10)
    await userModel.create({
      name:'gopi',
      email:'gopi1@gmail.com',
      password:hashedPassword,
      number:'9988776655'
    })
  })

  afterAll(async()=>{
    await userModel.deleteMany({})
  })  

  describe('signUp Route',()=>{
    it('signUp',async()=>{
      const response=await request(app)
      .post('/user/signUp')
      .send({
        name:'gopi',
        email:"gopi2@gmail.com",
        password:'Gopi@123',
        number:'9988776655'
      })
      expect(response.status).toBe(200)
      expect(response.body).toEqual({message:"User Created Successfully"})
    })
    it('user exists',async()=>{
      const response=await request(app)
      .post('/user/signUp')
      .send({
        email:'gopi3@gmail.com'
      })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({error:"User Exists Already"})
    })
  })
  
})