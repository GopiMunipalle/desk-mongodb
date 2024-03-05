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
const app_1 = __importDefault(require("../app"));
const user_1 = __importDefault(require("../models/user"));
const ProductList_1 = __importDefault(require("../models/ProductList"));
jest.mock('../controllers/fileController');
jest.mock('../models/user');
jest.mock('../models/ProductList');
describe('AddProduct API Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should add a product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMock = { email: 'test@example.com' }; // Mock a user
        const productMock = {
            name: 'Product Name',
            productId: '123',
            quantity: 10,
            status: 'active',
            price: 50,
            discountPrice: 45,
            image: ['https://example.com/image.jpg'], // Provide a mock image URL
        }; // Mock a product
        jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(userMock);
        jest.spyOn(ProductList_1.default, 'create').mockResolvedValueOnce(productMock);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/products/upload')
            .set('Authorization', 'Bearer yourAccessToken') // If authentication is required
            .send({
            name: 'Product Name',
            productId: '123',
            quantity: 10,
            status: 'active',
            price: 50,
            discountPrice: 45,
        });
        //   .attach('file', Buffer.from('image data'), 'test-image.jpg');
        // expect(userModel.findOne).toHaveBeenCalledWith({ email: 'gopi@example.com' });
        // expect(productModel.create).toHaveBeenCalledWith({
        //   name: 'Product Name',
        //   productId: '123',
        //   quantity: 10,
        //   status: 'active',
        //   price: 50,
        //   discountPrice: 45,
        //   image: ['https://example.com/image.jpg'],
        // });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Files Uploaded', product: productMock });
    }));
    //   it('should handle invalid user during product addition', async () => {
    //     jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
    //     const response = await request(app)
    //       .post('/products/upload')
    //       .set('Authorization', 'Bearer yourAccessToken')
    //       .send({
    //         name: 'Product Name',
    //         productId: '123',
    //         quantity: 10,
    //         status: 'active',
    //         price: 50,
    //         discountPrice: 45,
    //       })
    //       .attach('file', Buffer.from('image data'), 'test-image.jpg');
    //     expect(userModel.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    //     expect(productModel.create).not.toHaveBeenCalled();
    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({ error: 'Invalid User' });
    //   });
});
