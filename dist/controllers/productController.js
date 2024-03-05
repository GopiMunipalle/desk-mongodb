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
const ProductList_1 = __importDefault(require("../models/ProductList"));
const fileController_1 = __importDefault(require("./fileController"));
const user_1 = __importDefault(require("../models/user"));
const AddProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, productId, quantity, status, price, discountPrice } = req.body;
        var files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send({ error: "No files provided2" });
        }
        const fileUrls = yield (0, fileController_1.default)(files);
        const email = req.email;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ error: "Invalid User" });
        }
        const product = yield ProductList_1.default.create({
            name,
            productId,
            quantity,
            status,
            price,
            discountPrice,
            image: fileUrls
        });
        res.status(201).send({ message: "Files Uploaded", product });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const addImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log('id', id);
        const files = req.files;
        console.log('files', files);
        if (!files || files.length === 0) {
            return res.status(400).send({ error: "No files provided3" });
        }
        const fileUrls = yield (0, fileController_1.default)(files);
        console.log(fileUrls);
        const product = yield ProductList_1.default.findByIdAndUpdate({ _id: id }, { $push: { image: { $each: fileUrls } } }, { new: true });
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        console.log(product);
        return res.status(200).send({ message: "Images successfully added" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, url } = req.body;
        const product = yield ProductList_1.default.findByIdAndUpdate({ _id: productId }, { $pull: { image: url } }, { new: true });
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        console.log(product);
        return res.status(200).send({ message: "Image successfully deleted" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { AddProduct, addImages, deleteImage };
