import userController from "../controllers/userController";
import { Router } from "express";
import {authMiddleware,singUpValidation,loginValidation} from '../middlewares/userMiddleware'
const userRoute=Router()

userRoute.post('/signUp',singUpValidation,userController.signUp)
userRoute.post('/login',loginValidation,userController.login)
userRoute.get('/getLoginUser',authMiddleware,userController.getLoginUser)

export default userRoute
