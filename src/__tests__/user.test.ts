import request from 'supertest';
import userModel from '../models/user';
import app from '../app';

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
        
    });

    describe('loginUser',()=>{
       it('Should return email validation',async()=>{
            const response=await request(app)
            .post('/user/login')
            .send({
                email:"",
                password:"test"
            })
            expect(response.status).toBe(400)
            expect(response.body).toEqual({email:"email is Required"})
       })
       it('Should return password validation',async()=>{
        const response=await request(app)
        .post('/user/login')
        .send({
            email:"test@gmail.com",
            password:""
        })
        expect(response.status).toBe(400)
        expect(response.body).toEqual({password:"Enter Valid Password"})
       })
       it('Should return Internal Server Error',async()=>{
        const response=await request(app)
        .post('/user/login')
        .send({
            email:"test@gmail.co",
            password:"test"
        })
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
       })
       it('Should return User not Exists',async()=>{
        const res=await request(app)
        .post('/user/login')
        .send({
            email:"gopi@2gmail.com",
            password:"test"
        })
        expect(res.status).toBe(404)
        expect(res.body).toEqual({error:"User not found"})
       })
    })
});
