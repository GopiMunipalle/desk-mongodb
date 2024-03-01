import { Router } from "express";
import productController from "../controllers/productController";
const productRouter=Router()
import multer from "multer";
import {authMiddleware,addProductMiddleware} from '../middlewares/userMiddleware'
const upload=multer()



productRouter.post(
  "/upload",authMiddleware,upload.array("files", 3),addProductMiddleware,
 productController.AddProduct
);
productRouter.get('/productList',authMiddleware,productController.productList)
productRouter.post('/uploadImage/:id',upload.array('files',2),productController.addImages)
productRouter.delete('/deleteImage',productController.deleteImage)

export default productRouter