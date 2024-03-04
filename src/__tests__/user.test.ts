import request from 'supertest';
import userModel from '../models/user';
import app from '../app';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { authMiddleware } from '../middlewares/userMiddleware';
import { log } from 'console';


const SECRET_KEY = 'jwt_token_key';
describe('User Controller', () => {
    const user={
        _id:'65e16af81740521d1a094874',
        name:'gopi',
        email:"gopi@gmail.com",
        password:"hashedPassword",
        number:"9988776655"
    }
    afterAll(async()=>{
        await userModel.deleteMany({})
    })
    afterEach(() => {
        jest.restoreAllMocks();
      });
      
    describe('SignUp User', () => {
        it('Should return user created successfully', async () => {
            const mockResponse = await request(app)
                .post('/user/signUp')
                .send({
                    name: 'gopi',
                    email: 'gopi@gmail.com',
                    password: 'hashedPassword',
                    number: '9988776655',
                });


            expect(mockResponse.status).toBe(201);
            expect(mockResponse.body).toEqual({ message: 'User Created Successfully' });
        });

        it('Should return user exits already',async()=>{
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
            const response=await request(app)
            .post('/user/signUp')
            .send(user)
            expect(response.status).toBe(400)
            console.log(response.body , "===============>>>");
            
            expect(response.body).toEqual({error:"User Exists Already"})
        })
        it('Should return name is required',async()=>{
            const response=await request(app)
            .post('/user/signUp')
            .send({
                name:" ",
                email:"test@gmail.com",
                password:"test",
                number:"8899889988"
            })
            expect(response.status).toBe(400)
            expect(response.body).toEqual({name:"Enter Name"})
        })
        it('Should return email is required',async()=>{
            const res=await request(app)
            .post('/user/signUp')
            .send({
                name:'test',
                email:'',
                password:'test',
                number:'9988776655'
            })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({email:"email is Required"})
        })
        it('Should return password is required',async()=>{
            const res=await request(app)
            .post('/user/signUp')
            .send({
                name:'test',
                email:'test@gmail.com',
                password:'',
                number:'9988776655'
            })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({password:"Enter Valid Password"})
        })
        it('Should return number validation',async()=>{
            const res=await request(app)
            .post('/user/signUp')
            .send({
                name:'test',
                email:'test@gmail.com',
                password:'test',
                number:''
            })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({number:"Number must be containing 10 digits"})
        })
        it('Should return Internal Server Error',async()=>{
            jest.spyOn(userModel,'findOne').mockRejectedValueOnce(new Error("Db Error"))
            const response=await request(app)
            .post('/user/signUp')
            .send(user)
            expect(response.status).toBe(500)
            expect(response.body).toEqual({error:"Internal Server Error"})
        })
    });


    describe('loginUser', () => {
        it('Should return email validation', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({
                    email: "",
                    password: "test"
                });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ email: "email is Required" });
        });

        it('Should return password validation', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({
                    email: "test@gmail.com",
                    password: ""
                });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ password: "Enter Valid Password" });
        });

        it('Should return JWT token on successful login', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({
                    email: 'gopi@gmail.com',
                    password: 'hashedPassword', 
                });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('jwtToken');
        });
    
        it('Should return 404 when user is not found', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({
                    email: 'nonexistent.user@example.com',
                    password: 'anyPassword',
                });
    
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });
    
        it('Should return 400 on incorrect password', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({
                    email: 'gopi@gmail.com',
                    password: 'incorrectPassword', 
                });
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Incorrect Password' });
        });

        it('Should return Internal Server Error on database error', async () => {
            jest.spyOn(userModel, 'findOne').mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/user/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'anyPassword'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    }); 

    describe('getLoginUser',()=>{
        
        it('Should return error token value not present', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(true);

            const response = await request(app)
                .get('/user/getLoginUser')
                .set('authorization','Bearer ');
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({error:"Token not Provided"});
        });
    
        it('Should return error token not present', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(true);
    
            const response = await request(app)
                .get('/user/getLoginUser')
                .set('authorization','');
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Provide Token' });
        });

        it('Should return 400 on invalid token',async()=>{
            jest.spyOn(userModel,'findOne').mockResolvedValueOnce(true)
            let token=`Bearer jwtToken`
            const response=await request(app)
            .get('/user/getLoginUser')
            .set('authorization',token)
            jest.spyOn(Jwt,'verify').mockResolvedValueOnce(false as never)
            expect(response.status).toBe(400)
            expect(response.body).toEqual({error:"Invalid Token"})
        })
    
        // it('Should return 200 on Success', async () => {
            
        //     jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
        
        //     const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcGlAZ21haWwuY29tIn0.EThO8IJuXlt65UdsSr2Pb-Nefc_867Qre9aiRJFjyzA';
        //     jest.spyOn(Jwt, 'verify').mockResolvedValueOnce(token as never);

        
        //     const response = await request(app)
        //         .get('/user/getLoginUser')
        //         .set('authorization', token);
        
        //     expect(response.status).toBe(200);
        //     expect(response.body).toEqual(user);
        // },30000);
          
    })
});


