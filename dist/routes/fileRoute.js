"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileMiddleware_1 = __importDefault(require("../middlewares/fileMiddleware"));
const fileController_1 = __importDefault(require("../controllers/fileController"));
const fileRouter = (0, express_1.Router)();
fileRouter.post('/single', fileMiddleware_1.default, fileController_1.default);
exports.default = fileRouter;
