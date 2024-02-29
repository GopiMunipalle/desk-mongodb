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
const ProdImage_1 = __importDefault(require("../models/ProdImage"));
const ProductList_1 = __importDefault(require("../models/ProductList"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image, itemId, upload, delItemId } = req.body;
        const product = yield ProductList_1.default.findOne({ productId: itemId });
        if (!product) {
            return res.status(404).send({ error: "Product id not found" });
        }
        const newImage = yield ProdImage_1.default.create({
            productId: product.productId,
            image: image
        });
        if (!upload) {
            yield product.updateOne({
                $pull: { image: { _id: newImage._id } },
            });
            yield ProdImage_1.default.findOneAndDelete({ _id: delItemId });
            return res.status(200).send({ message: "deleted Successfully" });
        }
        yield product.updateOne({
            $push: { image: { _id: newImage._id } },
        });
        console.log(upload);
        return res.status(200).send({ message: "Product Image Uploaded" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const getProductsWithImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const images = yield ProductList_1.default.findById(id).populate('image');
        res.send(images);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { uploadImage, getProductsWithImages };
