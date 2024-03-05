"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
const productRouter = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const userMiddleware_1 = require("../middlewares/userMiddleware");
const upload = (0, multer_1.default)();
productRouter.post("/upload", userMiddleware_1.authMiddleware, upload.array("files", 3), userMiddleware_1.addProductMiddleware, productController_1.default.AddProduct);
productRouter.post('/uploadImage/:id', upload.array('files', 2), productController_1.default.addImages);
productRouter.delete('/deleteImage', productController_1.default.deleteImage);
exports.default = productRouter;
