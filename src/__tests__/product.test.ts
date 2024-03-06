import request from 'supertest';
import app from '../app'; 
import userModel from '../models/user';
import productModel from '../models/ProductList';
import cloudinary from '../utils/cloudinary'; 
import uploadImages from '../controllers/fileController';

jest.mock('../controllers/fileController');

jest.mock('../models/user');
jest.mock('../models/ProductList');

// describe('AddProduct API Endpoint', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   const mockFiles = [
//     { buffer: Buffer.from('image data 1') },
//     { buffer: Buffer.from('image data 2') },
//   ];

//   it.only('should add a product successfully', async () => {

//     jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(true);
//     jest.spyOn(productModel, 'create').mockResolvedValueOnce(true as never);

//     const mockFiles = [
//       { buffer: Buffer.from('image data 1') },
//       { buffer: Buffer.from('image data 2') },
//     ];
    
//     const productMock = {
//       name: 'Product Name',
//       productId: '123',
//       quantity: 10,
//       status: 'active',
//       price: 50,
//       discountPrice: 45
//     }; 
//     const mockCloudinaryResult = [
//       'https://cloudinary.com/image1.jpg',
//       'https://cloudinary.com/image2.jpg',
//     ];
//     jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce({ secure_url: 'https://cloudinary.com/image1.jpg' } as never);

//     // jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce(true as never)
  
//     const response = await request(app)
//       .post('/products/upload')
//       .set('Authorization', 'Bearer yourAccessToken') 
//       .send({
//         files:mockFiles,
//         name: 'Product Name',
//         productId: '123',
//         quantity: 10,
//         status: 'active',
//         price: 50,
//         discountPrice: 45
//         })
//       // .attach('files', Buffer.from('image data'), 'test-image.jpg');

//       console.log('201 body',response.body)

//     // expect(response.status).toBe(201);
//     expect(response.body).toEqual({ message: 'Files Uploaded', product: productMock });
//   });

//   it('should handle missing files', async () => {
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
//       });

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ error: 'No files provided2' });
//   });

//   it('should handle invalid user', async () => {
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
      

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ error: 'Invalid User' });
//   });

//   it('should handle internal server error', async () => {
//     jest.spyOn(userModel, 'findOne').mockRejectedValueOnce(new Error('Database error'));

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
      

//     expect(response.status).toBe(500);
//     expect(response.body).toEqual({ error: 'Internal Server Error' });
//   });
//   it('Should Return 400 Name filed is Required',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({name:""})

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Name field is Required"}])
//   })
//   it('Should Return 400 ProductId filed is Required',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({name:"gopi",
//            productId:""})

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Enter Valid Product id"}])
//   })
//   it('Should Return 400 quantity is Required',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({name:"gopi",
//            productId:"32",
//            quantity:""})

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Enter Quantity"}])
//   })
//   it('Should Return 400 missing status',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({
//       name:"gopi",
//       productId:"32",
//       quantity:"20",
//       status:""
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Enter Product Status"}])
//   })
//   it('Should Return 400 Product Price',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({
//       name:"gopi",
//       productId:"32",
//       quantity:"20",
//       status:"in stock",
//       price:''
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Enter product Price"}])
//   })
//   it('Should Return 400 discount Price',async()=>{
//     jest.spyOn(productModel,'findOne').mockResolvedValueOnce(true)
//     const response=await request(app)
//     .post('/products/upload')
//     .send({
//       name:"gopi",
//       productId:"32",
//       quantity:"20",
//       status:"in stock",
//       price:'90',
//       discountPrice:''
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toEqual([{error:"Enter discount price"}])
//   })
// });

describe('Add Image API EndPoint',()=>{
  const mockImage={
    files:'www.example.png',
    id:'65e16af81740521d1a094874'
  }
  it('Should Return 400 No files Provided',async()=>{
    const response=await request(app)
    .post('/products/uploadImage/:id')
    .send(mockImage)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error:"No files provided3"})
  })
})




// type UploadStream = (callback?: UploadResponseCallback | undefined) => void;

// describe('uploadImages Function', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it.only('should upload images successfully', async () => {

//     const mockFiles = [
//       { buffer: Buffer.from('image data 1') },
//       { buffer: Buffer.from('image data 2') },
//     ];
    
//     const productMock = {
//       name: 'Product Name',
//       productId: '123',
//       quantity: 10,
//       status: 'active',
//       price: 50,
//       discountPrice: 45
//     }; 
//     const mockCloudinaryResult = [
//       'https://cloudinary.com/image1.jpg',
//       'https://cloudinary.com/image2.jpg',
//     ];
//     // jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce({ secure_url: 'https://cloudinary.com/image1.jpg' } as never);

//     jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce(true as never)
  
//     const response = await request(app)
//       .post('/products/upload')
//       .set('Authorization', 'Bearer yourAccessToken') 
//       .send({
//         files:mockFiles,
//         name: 'Product Name',
//         productId: '123',
//         quantity: 10,
//         status: 'active',
//         price: 50,
//         discountPrice: 45
//         })
//     // expect(response.status).toBe(200);
//     expect(response.body).toEqual({ urls: mockCloudinaryResult });
//   });

//   it('should handle upload failure', async () => {
//     const mockFiles = [{ buffer: Buffer.from('image data') }];

//     jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce(true as never);

//     const response = await request(app)
//       .post('/products/upload')
//       .send({ files: mockFiles });

//     // expect(response.status).toBe(400);
//     expect(response.body).toEqual({ error: 'Upload failed' });
//   });

//   it('should handle undefined upload result', async () => {
//     const mockFiles = [{ buffer: Buffer.from('image data') }];

//     jest.spyOn(cloudinary.uploader, 'upload_stream').mockResolvedValueOnce(false as never)

//     const response = await request(app)
//       .post('/products/upload')
//       .send({ files: mockFiles });

//     // expect(response.status).toBe(400);
//     expect(response.body).toEqual({ error: 'Upload result is undefined' });
//   });

//   it('should handle missing files', async () => {
//     const response = await request(app)
//       .post('/products/upload')
//       .send({ files: [] });

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ error: 'No files provided' });
//   });
// });


// Mock the cloudinary module
jest.mock('../utils/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn(),
  },
}));

describe('AddProduct API Endpoint', () => {
  const mockFiles = [
    { buffer: Buffer.from('image data 1') },
    { buffer: Buffer.from('image data 2') },
  ];

  const validUser = {
    email: 'test@example.com',
  };

  const mockUser = {
    email: 'test@example.com',
  };

  const validProductRequest = {
    name: 'Test Product',
    productId: '123',
    quantity: 10,
    status: 'active',
    price: 50,
    discountPrice: 45,
    files:mockFiles
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
  });

  it('should add a product successfully', async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((_, callback) => {
      callback(null, { secure_url: 'https://cloudinary.com/image1.jpg' });
    });

    let token='jwtToken'
    // let token='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcGlrcmlzaG11bmlwYWxsaUBnbWFpbC5jb20iLCJpYXQiOjE3MDk3MjE3NTUsImV4cCI6MTcxMjMxMzc1NX0.Eq-qiCv2zfHl1DC9crV2PGmsWjv224m76BNRMlZRnBg'
    const response = await request(app)
      .post('/products/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...validProductRequest,
        files: mockFiles,
      });

    // expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Files Uploaded'});
  });

});
