import request from 'supertest';
import app from '../../src/app';
import userModel from '../../src/models/user';
import bcrypt from 'bcrypt';

describe('User Controller',()=>{
  const mockUser={email:"gopi@gmail.com"}
  beforeAll(async()=>{
    const hashedPassword=await bcrypt.hash('testPassword',10)
    const user=userModel.create({
      name:'name',
      email:'test@gmail.com',
      password:'Password33',
      number:'333333332'
    })
  })
  afterAll(async()=>{
    await userModel.deleteMany({})
  })

  describe('SignUp User model',()=>{
    it('signUp',async()=>{
      const response=await request(app)
      .post('/user/signUp')
      .send({
        name:"gopi",
        email:"gopi@gmail.com",
        password:"Gopi@123",
        number:"9988776655"
      })
      expect(response.status).toBe(201)
      expect(response.body).toEqual({message:"User Created Successfully"})
    })
    it('User Exists',async()=>{
      const response=await request(app)
      .post('/user/signUp')
      .send({
        name:"gopi",
        email:'gopi@gmail.com',
        password:"Gopi@123",
        number:"9988776655"
      })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({error:"User Exists Already"})
    })
  })

  describe('Login User',()=>{
    it('Login User',async()=>{
      const response=await request(app)
      .post('/user/login')
      .send({
        email:"gopi@gmail.com",
        password:"Gopi@123"
      })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('jwtToken')
    })
    it('Incorrect Email',async()=>{
      const response=await request(app)
      .post('/user/login')
      .send({
        email:"gop@gmail.com",
        password:"Gopi@123"
      })
      expect(response.status).toBe(404)
      expect(response.body).toEqual({error:"User not found"})
    })
    it('Incorrect Password',async()=>{
      const response=await request(app)
      .post('/user/login')
      .send({
        email:'gopi@gmail.com',
        password:"gopi"
      })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({error:"Incorrect Password"})
    })
  })

  describe('GetLogin User',()=>{
    it('Get Login',async()=>{
      const respose=await request(app)
      .get('/user/getLoginUser')
    })
  })
})

