"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
const productRouter = (0, express_1.Router)();
productRouter.get('/productList', productController_1.default.productList);
productRouter.post('/addProduct', productController_1.default.AddProduct);
exports.default = productRouter;
