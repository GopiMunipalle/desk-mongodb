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
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const uploadImages = (files) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
            const stream_to_cloud_pipe = cloudinary_1.default.uploader.upload_stream({ folder: "desk-mongo" }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (result) {
                        resolve(result.secure_url);
                    }
                    else {
                        reject(new Error("Upload result is undefined"));
                    }
                }
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
        });
    }));
});
exports.default = uploadImages;
