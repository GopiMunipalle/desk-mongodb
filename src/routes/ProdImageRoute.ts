import { Router } from "express";
import prodImageController from "../controllers/prodImageController";
const prodImageRouter=Router()


prodImageRouter.post('/upload',prodImageController.uploadImage)
prodImageRouter.get('/get/:id',prodImageController.getProductsWithImages)

export default prodImageRouter