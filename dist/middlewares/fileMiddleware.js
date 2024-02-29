"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
cloudinary_1.v2.config({
    cloud_name: process.env.NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const uploadImagesMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.files);
        if (!req.files) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
        // let files=req.files
        let files = req.files;
        const uploadedImages = [];
        console.log(files);
        for (const file of files) {
            const result = yield cloudinary_1.v2.uploader.upload(file.path);
            console.log(result);
            // file.url = result.secure_url;
            // file.public_id = result.public_id;
            // uploadedImages.push(file);
        }
        // req.files = uploadedImages;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = uploadImagesMiddleware;
