"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const username = encodeURIComponent("alexandr");
const password = encodeURIComponent((_a = process.env.password) === null || _a === void 0 ? void 0 : _a.replace(/"/g, ''));
console.log(username);
console.log(password);
mongoose_1.default.connect(`mongodb://${username}:${password}@87.236.22.124:27017/profori?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => { console.error(error); });
mongoose_1.default.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});
//# sourceMappingURL=database.js.map