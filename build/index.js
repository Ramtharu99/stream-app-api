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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const bcrypt_1 = require("bcrypt");
const stream_chat_1 = require("stream-chat");
const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = stream_chat_1.StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
const app = (0, express_1.default)();
app.use(express_1.default.json());
const salt = (0, bcrypt_1.genSaltSync)(10);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hello World");
}));
const USERS = [];
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const userExists = USERS.find(user => user.email === email);
    if (userExists) {
        throw new Error("User already exists");
    }
    try {
        const hashed_passsword = (0, bcrypt_1.hashSync)(password, salt);
        const id = Math.random().toString(36).slice(2);
        const newUser = {
            id,
            email,
            hashed_passsword
        };
        USERS.push(newUser);
        yield client.upsertUser({
            id,
            name: email,
            email,
        });
        const token = client.createToken(id);
        return res.status(201).json({ token, user: { id, email } });
    }
    catch (error) {
        res.status(500).json({ message: "User already exists" });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = USERS.find(user => user.email === email);
    const hashed_password = (0, bcrypt_1.hashSync)(password, salt);
    if (!user || user.hashed_passsword !== hashed_password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = client.createToken(user.id);
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map