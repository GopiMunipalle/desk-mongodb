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
const node_fetch_1 = __importDefault(require("node-fetch"));
const productList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = 'https://fakestoreapi.com/products';
        const response = yield (0, node_fetch_1.default)(url);
        const data = yield response.json();
        console.log(data);
        for (let product of data) {
            let { id, title, price, image, rating } = product;
            let status = '';
            let discount = price - (price / 5);
            if (id <= 10) {
                status = "In Stock";
                discount = price - (price / 10);
            }
            else {
                status = "Out Of Stock";
                discount = price - (price / 15);
            }
            yield ProductList_1.default.insertMany([{
                    name: title,
                    productId: id,
                    quantity: rating.count,
                    status: status,
                    price: price,
                    discountPrice: discount,
                    image: [image]
                }]);
        }
        return res.status(200).send({ message: "Products Added" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const AddProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, productId, quantity, status, price, discountPrice, image } = req.body;
        const product = yield ProductList_1.default.findOne({ productId: productId });
        if (!product) {
            const newProduct = yield ProductList_1.default.create({
                name,
                productId,
                quantity,
                status,
                price,
                discountPrice,
                image: [image]
            });
            return res.status(201).send({ message: "Product Added" });
        }
        return res.status(400).send({ error: "Product id exists" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = { productList, AddProduct };
