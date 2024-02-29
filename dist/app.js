"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const otpRoute_1 = __importDefault(require("./routes/otpRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const ProdImageRoute_1 = __importDefault(require("./routes/ProdImageRoute"));
const fileRoute_1 = __importDefault(require("./routes/fileRoute"));
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/user', userRoute_1.default);
app.use('/otp', otpRoute_1.default);
app.use('/products', productRoute_1.default);
app.use('/image', ProdImageRoute_1.default);
app.use('/file', fileRoute_1.default);
(0, db_1.default)()
    .then(() => {
    app.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.log('db not connected', error);
});
exports.default = app;
