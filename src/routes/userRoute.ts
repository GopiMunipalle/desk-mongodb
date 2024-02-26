import userController from "../controllers/userController";
import { Router } from "express";
import middleware from '../middlewares/userMiddleware'
const userRoute=Router()

userRoute.post('/signUp',middleware.singUpValidation,userController.signUp)
userRoute.post('/login',middleware.loginValidation,userController.login)
userRoute.get('/getLoginUser',middleware.authMiddleware,userController.getLoginUser)

export default userRoute
