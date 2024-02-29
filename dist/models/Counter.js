"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productId: {
        type: Number,
        required: true
    }
});
const counterModel = (0, mongoose_1.model)("Counter", productSchema);
exports.default = counterModel;
