"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
cloudinary_1.v2.config({
    cloud_name: process.env.NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});
exports.default = cloudinary_1.v2;
