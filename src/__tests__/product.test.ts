import request from 'supertest';
import app from '../app'; 
import userModel from '../models/user';
import productModel from '../models/ProductList';

jest.mock('../controllers/fileController');

describe('AddProduct API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userMock = { email: 'test@example.com' }; 

  const productMock = {
    name: 'Product Name',
    productId: '123',
    quantity: 10,
    status: 'active',
    price: 50,
    discountPrice: 45,
    image: ['https://example.com/image.jpg'],
  }; 

  it('should add a product successfully', async () => {

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(userMock);
    jest.spyOn(productModel, 'create').mockResolvedValueOnce(productMock as never);

    const response = await request(app)
      .post('/products/upload')
      .set('Authorization', 'Bearer Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcGlAZ21haWwuY29tIn0.EThO8IJuXlt65UdsSr2Pb-Nefc_867Qre9aiRJFjyzA') 
      .send(productMock)

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Files Uploaded', product: productMock });
  });
  it.only('Should return 500 Internal Server Error',async()=>{
    jest.spyOn(userModel,'findOne').mockRejectedValueOnce(new Error('db error'))
    const response=await request(app)
    .post('//products/upload')
    .set('authorization','Bearer token')
    .send(productMock)

    expect(response.status).toBe(500)
    expect(response.body).toEqual({error:"Internal Server Error"})
  })
});
