import { Router } from "express";
import productController from "../controllers/productController";
const productRouter=Router()

productRouter.get('/productList',productController.productList)
productRouter.post('/addProduct',productController.AddProduct)

export default productRouter