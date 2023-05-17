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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretPath = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const IUser_1 = require("./models/IUser");
const IPayment_1 = require("./models/IPayment");
const mongodb_1 = require("mongodb");
const index_1 = require("./index");
const cors_1 = __importDefault(require("cors"));
const morgan = require("morgan");
const PORT = process.env.PORT;
const app = (0, express_1.default)();
exports.secretPath = `/telegraf/${index_1.bot.secretPathComponent()}`;
app.use(body_parser_1.default.json());
// Handle POST request to '/bot'
app.use(index_1.bot.webhookCallback(exports.secretPath));
console.log((_a = process.env.mode) === null || _a === void 0 ? void 0 : _a.replace(/"/g, ''));
console.log(((_b = process.env.mode) === null || _b === void 0 ? void 0 : _b.replace(/"/g, '')) === 'production');
console.log(typeof ((_c = process.env.mode) === null || _c === void 0 ? void 0 : _c.replace(/"/g, '')));
// if (process.env.mode?.replace(/"/g, '') === 'production') {
//     const privateKey = fs.readFileSync('/app/ssl/privkey.pem', 'utf8');
//     const certificate = fs.readFileSync('/app/ssl/fullchain.pem', 'utf8');
//     const credentials = {
//         key: privateKey,
//         cert: certificate,
//     };
//     const server = https.createServer(credentials, app);
//     server.listen(PORT, () => {
//         console.log(`Server listening on port ${PORT}`)
//     })
// } else {
//     // Start the server and listen on the specified port
// }
app.get("/", (req, res) => res.send("Бот запущен!"));
// Handle GET request to '/success'
app.get('/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the billId from the request URL
    let billId = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);
}));
// Handle GET request to '/payment/success'
app.get('/payment/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the billId from the request URL
    let billId = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);
    // Find the payment document using the billId
    let payment = yield IPayment_1.Payment.findOne({
        _id: new mongodb_1.ObjectId(billId)
    });
    // Find the user document using the payment's user_id
    let user = yield IUser_1.User.findOne({
        id: payment === null || payment === void 0 ? void 0 : payment.user_id
    });
    if (user && payment) {
        // Send a sticker and a message to the user using the Telegram bot
        yield index_1.bot.telegram.sendSticker(user === null || user === void 0 ? void 0 : user.id, 'CAACAgIAAxkBAAEIRdBkHZukHX1iJJVPMeQmZvfKXRgfDQACiRkAAkHrwEvwxgiNPD3Rai8E');
        yield index_1.bot.telegram.sendMessage(user === null || user === void 0 ? void 0 : user.id, 'Спасибо за внесенный платеж!', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        });
        // Update the user's 'supported' field by adding the payment amount
        yield IUser_1.User.findOneAndUpdate({
            id: user.id
        }, {
            $set: {
                supported: user.supported + payment.amount
            }
        });
    }
    // Redirect the user to 'https://t.me/burlive_bot'
    res.redirect('https://t.me/burlive_bot');
}));
app.use(morgan("dev"));
app.use((0, cors_1.default)());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map