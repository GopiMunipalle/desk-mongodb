"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductMiddleware = exports.authMiddleware = exports.loginValidation = exports.singUpValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const SECRET_KEY = process.env.SECRET_KEY;
const singUpValidation = (req, res, next) => {
    try {
        let errors = {};
        // let emailFormate=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        const { name, email, password, number } = req.body;
        if (!name || name.trim().length == 0) {
            errors.name = "Enter Name";
        }
        else if (name.length < 4) {
            errors.name = "Name must be containing at least 4 characters";
        }
        else if (!email || email.trim().length == 0) {
            errors.email = "email is Required";
        }
        else if (!password) {
            errors.password = "Enter Valid Password";
        }
        else if (!number) {
            errors.number = "Number must be containing 10 digits";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).send(errors);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.singUpValidation = singUpValidation;
const loginValidation = (req, res, next) => {
    try {
        let errors = {};
        // let emailFormate=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        const { email, password } = req.body;
        if (!email || email.trim().length == 0) {
            errors.email = "email is Required";
        }
        else if (!password) {
            errors.password = "Enter Valid Password";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).send(errors);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.loginValidation = loginValidation;
const authMiddleware = (req, res, next) => {
    try {
        let jwtToken = null;
        const authHeaders = req.headers['authorization'];
        if (!authHeaders) {
            return res.status(400).send({ error: "Provide Token" });
        }
        jwtToken = authHeaders.split(' ')[1];
        if (!jwtToken) {
            return res.status(400).send({ error: "Token not Provided" });
        }
        jsonwebtoken_1.default.verify(jwtToken, SECRET_KEY, (err, payload) => {
            if (err) {
                return res.status(400).send({ error: "Invalid Token" });
            }
            req.email = payload.email;
            next();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.authMiddleware = authMiddleware;
const addProductMiddleware = (req, res, next) => {
    try {
        const { name, productId, quantity, status, price, discountPrice } = req.body;
        const errors = [];
        if (!name || name.trim().length == 0) {
            errors.push({ error: "Name field is Required" });
        }
        else if (!productId || productId.trim().length == 0) {
            errors.push({ error: "Enter Valid Product id" });
        }
        else if (!quantity || quantity.trim().length == 0) {
            errors.push({ error: "Enter Quantity" });
        }
        else if (!status || status.trim().length == 0) {
            errors.push({ error: "Enter Product Status" });
        }
        else if (!price || price.trim().length == 0) {
            errors.push({ error: "Enter product Price" });
        }
        else if (!discountPrice || discountPrice.trim().length == 0) {
            errors.push({ error: "Enter discount price" });
        }
        if (errors && errors.length > 0) {
            return res.status(400).send(errors);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server error" });
    }
};
exports.addProductMiddleware = addProductMiddleware;
