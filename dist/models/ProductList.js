"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    productId: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true
    },
    image: {
        type: [],
        required: false
    }
}, { versionKey: false, timestamps: true });
const productModel = (0, mongoose_1.model)('ProductList', productsSchema);
exports.default = productModel;
