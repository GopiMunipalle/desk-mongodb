"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controllers/userController"));
const express_1 = require("express");
const userMiddleware_1 = __importDefault(require("../middlewares/userMiddleware"));
const userRoute = (0, express_1.Router)();
userRoute.post('/signUp', userMiddleware_1.default.singUpValidation, userController_1.default.signUp);
userRoute.post('/login', userMiddleware_1.default.loginValidation, userController_1.default.login);
userRoute.get('/getLoginUser', userMiddleware_1.default.authMiddleware, userController_1.default.getLoginUser);
exports.default = userRoute;
