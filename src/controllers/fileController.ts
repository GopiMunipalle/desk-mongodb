import express, { Request, Response } from 'express';
import productModel from '../models/ProductList';


const uploadImages=(async (req: Request, res: Response) => {
  try {
    
    const { name, productId, quantity, status, price, discountPrice } = req.body;

    // const image = req.files[0].url;

    const newProduct = await productModel.create({
      name,
      productId,
      quantity,
      status,
      price,
      discountPrice,
      // image,
    });

    return res.status(201).json({ newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default uploadImages;
