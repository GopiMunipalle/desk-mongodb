"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailOtp_1 = __importDefault(require("../models/EmailOtp"));
const user_1 = __importDefault(require("../models/user"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
jest.mock('../utils/emailTransport');
describe('sendOtp', () => {
    const mockOtp = {
        email: "gopi@gmail.com",
        otp: "898989",
        createdAt: "1723892304"
    };
    it('Should Return 404 User not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(false);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/sendOtp')
            .send({
            email: "gopi@gmail.com"
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "User not Exists" });
    }));
    it('Should Return Create Otp', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(true);
        jest.spyOn(EmailOtp_1.default, 'create').mockResolvedValueOnce({});
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/sendOtp')
            .send({
            email: "gopi@gmail.com"
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Otp sent to gopi@gmail.com" });
    }));
    it('Should Return Internal Server Error', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findOne').mockRejectedValueOnce(new Error('db error'));
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/sendOtp')
            .send({
            email: "gopi@gmail.com"
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal Server Error" });
    }));
    describe('get otp controller', () => {
        it('Should Get otp', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(EmailOtp_1.default, 'find').mockResolvedValueOnce(true);
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/otp/getOtp');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(true);
        }));
        it('Should return Internal Server ERror', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(EmailOtp_1.default, 'find').mockRejectedValueOnce(new Error('db error'));
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/otp/getOtp');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server Error" });
        }));
    });
});
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
    it('should verify OTP successfully for a valid user and valid OTP', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(EmailOtp_1.default, 'findOne').mockResolvedValue(validOtpRecord);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Otp Verification Successful' });
    }));
    it('should handle user not found during OTP verification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(EmailOtp_1.default, 'findOne').mockResolvedValue(null);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/verifyOtp')
            .send({ email: 'nonexistent@example.com', otp: '123456' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'User not found' });
    }));
    it('should handle OTP verification timeout', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(EmailOtp_1.default, 'findOne')
            .mockResolvedValueOnce({ otp: '123456' })
            .mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Otp timed out' });
    }));
    it('should handle internal server error during OTP verification', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(EmailOtp_1.default, 'findOne').mockRejectedValueOnce(new Error('Database error'));
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/otp/verifyOtp')
            .send({ email: 'gopi@gmail.com', otp: '123456' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
    }));
});
