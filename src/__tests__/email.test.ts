import emailModel from "../models/EmailOtp";
import userModel from "../models/user";
import request from 'supertest'
import app from "../app";
import transport from '../utils/emailTransport'

jest.mock('../utils/emailTransport')

describe('sendOtp',()=>{

    const mockOtp={
        email:"gopi@gmail.com",
        otp:"898989",
        createdAt:"1723892304"
    }
    it('Should Return 404 User not exists',async()=>{
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce(false)
        const response=await request(app)
        .post('/otp/sendOtp')
        .send({
            email:"gopi@gmail.com"
        })
        expect(response.status).toBe(404)
        expect(response.body).toEqual({error:"User not Exists"})
    })
    it('Should Return Create Otp',async()=>{
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce(true)
        jest.spyOn(emailModel,'create').mockResolvedValueOnce({} as never)
        const response=await request(app)
        .post('/otp/sendOtp')
        .send({
            email:"gopi@gmail.com"
        })
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Otp sent to gopi@gmail.com"})
    })
    it('Should Return Internal Server Error', async () => {
        jest.spyOn(userModel, 'findOne').mockRejectedValueOnce(new Error('db error'));
      
        const response = await request(app)
          .post('/otp/sendOtp')
          .send({
            email: "gopi@gmail.com"
          });
      
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal Server Error" });
    });
    describe('get otp controller',()=>{
        it('Should Get otp',async()=>{
            jest.spyOn(emailModel,'find').mockResolvedValueOnce(true as never)
            const response=await request(app)
            .get('/otp/getOtp')

            expect(response.status).toBe(200)
            expect(response.body).toEqual(true)
        })
        it('Should return Internal Server ERror',async()=>{
            jest.spyOn(emailModel,'find').mockRejectedValueOnce(new Error('db error'))
            const response=await request(app)
            .get('/otp/getOtp')
            expect(response.status).toBe(500)
            expect(response.body).toEqual({error:"Internal Server Error"})
        })
    })   
})

describe('verifyOtp API Endpoint', () => {
    const validUser = {
        email: 'gopi@gmail.com',
    };

    const validOtpRecord = {
        email: 'gopi@gmail.com',
        otp: '123456',
        createdAt: new Date(),
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should verify OTP successfully for a valid user and valid OTP', async () => {
        jest.spyOn(emailModel, 'findOne').mockResolvedValue(validOtpRecord);

        const response = await request(app)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Otp Verification Successful' });
    });

    it('should handle user not found during OTP verification', async () => {
        jest.spyOn(emailModel, 'findOne').mockResolvedValue(null);

        const response = await request(app)
            .post('/otp/verifyOtp')
            .send({ email: 'nonexistent@example.com', otp: '123456' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should handle OTP verification timeout', async () => {
        jest.spyOn(emailModel, 'findOne')
            .mockResolvedValueOnce({ otp: '123456' })
            .mockResolvedValueOnce(null); 

        const response = await request(app)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Otp timed out' });
    });

    it('should handle internal server error during OTP verification', async () => {
        jest.spyOn(emailModel, 'findOne').mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
});
