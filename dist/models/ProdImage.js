"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true
    },
    image: {
        type: [],
        required: true
    }
}, { versionKey: false, timestamps: true });
const imageModel = (0, mongoose_1.model)("ProdImage", imageSchema);
exports.default = imageModel;
