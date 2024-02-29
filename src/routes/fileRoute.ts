import fileController from "../controllers/fileController";
import { Router } from "express";
import uploadImagesMiddleware from "../middlewares/fileMiddleware";
import uploadImages from "../controllers/fileController";
const fileRouter=Router()


fileRouter.post('/single',uploadImagesMiddleware,uploadImages)

export default fileRouter