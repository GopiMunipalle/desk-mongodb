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
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const SECRET_KEY = process.env.SECRET_KEY;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, number } = req.body;
        // console.log(req.body)
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // console.log(hashedPassword)
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            const newUser = new user_1.default({
                name,
                email,
                password: hashedPassword,
                number
            });
            yield newUser.save();
            return res.status(201).send({ message: "User Created Successfully" });
        }
        return res.status(400).send({ error: "User Exists Already" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const validatePassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validatePassword) {
            return res.status(400).send({ error: "Incorrect Password" });
        }
        let payload = { email: email };
        const jwtToken = jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '30d' });
        return res.status(200).send({ jwtToken: jwtToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const getLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.email;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "User not exists" });
        }
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { signUp, login, getLoginUser };
