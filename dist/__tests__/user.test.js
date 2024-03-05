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
const supertest_1 = __importDefault(require("supertest"));
const user_1 = __importDefault(require("../models/user"));
const app_1 = __importDefault(require("../app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('User Controller', () => {
    const user = {
        _id: '65e16af81740521d1a094874',
        name: 'gopi',
        email: "gopi@gmail.com",
        password: "hashedPassword",
        number: "9988776655"
    };
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('SignUp User', () => {
        it('Should return user created successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send({
                name: 'gopi',
                email: 'gopi@gmail.com',
                password: 'hashedPassword',
                number: '9988776655',
            });
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.body).toEqual({ message: 'User Created Successfully' });
        }));
        it('Should return user exits already', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(user);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send(user);
            expect(response.status).toBe(400);
            console.log(response.body, "===============>>>");
            expect(response.body).toEqual({ error: "User Exists Already" });
        }));
        it('Should return name is required', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send({
                name: " ",
                email: "test@gmail.com",
                password: "test",
                number: "8899889988"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ name: "Enter Name" });
        }));
        it('Should return email is required', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send({
                name: 'test',
                email: '',
                password: 'test',
                number: '9988776655'
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ email: "email is Required" });
        }));
        it('Should return password is required', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send({
                name: 'test',
                email: 'test@gmail.com',
                password: '',
                number: '9988776655'
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ password: "Enter Valid Password" });
        }));
        it('Should return number validation', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send({
                name: 'test',
                email: 'test@gmail.com',
                password: 'test',
                number: ''
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ number: "Number must be containing 10 digits" });
        }));
        it('Should return Internal Server Error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockRejectedValueOnce(new Error("Db Error"));
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/signUp')
                .send(user);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal Server Error" });
        }));
    });
    describe('loginUser', () => {
        it('Should return email validation', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: "",
                password: "test"
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ email: "email is Required" });
        }));
        it('Should return password validation', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: "test@gmail.com",
                password: ""
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ password: "Enter Valid Password" });
        }));
        it('Should return JWT token on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: 'gopi@gmail.com',
                password: 'hashedPassword',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('jwtToken');
        }));
        it('Should return 404 when user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: 'nonexistent.user@example.com',
                password: 'anyPassword',
            });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        }));
        it('Should return 400 on incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: 'gopi@gmail.com',
                password: 'incorrectPassword',
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Incorrect Password' });
        }));
        it('Should return Internal Server Error on database error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockRejectedValueOnce(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/user/login')
                .send({
                email: 'test@gmail.com',
                password: 'anyPassword'
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        }));
    });
    describe('getLoginUser', () => {
        it('Should return error token value not present', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(true);
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/user/getLoginUser')
                .set('authorization', 'Bearer ');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Token not Provided" });
        }));
        it('Should return error token not present', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(true);
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/user/getLoginUser')
                .set('authorization', '');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Provide Token' });
        }));
        it('Should return 400 on invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(true);
            let token = `Bearer jwtToken`;
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/user/getLoginUser')
                .set('authorization', token);
            jest.spyOn(jsonwebtoken_1.default, 'verify').mockResolvedValueOnce(false);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid Token" });
        }));
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
    });
});
