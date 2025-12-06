"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_route_js_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map