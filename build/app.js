"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('./model/index');
const PORT = 4000;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send("Hello");
});
app.listen(PORT, () => {
    console.log("Server has started at port", PORT);
});
