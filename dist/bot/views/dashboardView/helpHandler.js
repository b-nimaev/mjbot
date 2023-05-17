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
const format_money_1 = __importDefault(require("../../utlis/format_money"));
const greeting_1 = __importDefault(require("./greeting"));
const IPayment_1 = require("../../../models/IPayment");
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const secret_key = process.env.secret_key;
const publicKey = process.env.public_key;
const qiwiApi = new QiwiBillPaymentsAPI(secret_key);
function help_handler(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Поддержка проекта 💰</b> \n\n`;
            // await get_link_for_payment(ctx)
            message += `Введите желаемую сумму в рублях для поддержки проекта\n\n`;
            message += `Минимальная сумма: 1 ₽\n`;
            message += `Максимальная сумма: 60 000 ₽`;
            let extra = {
                parse_mode: 'HTML',
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
            };
            if (ctx.updateType === 'callback_query') {
                // @ts-ignore
                if (ctx.callbackQuery.data) {
                    // @ts-ignore
                    let data = ctx.callbackQuery.data;
                    if (data === 'back') {
                        ctx.wizard.selectStep(0);
                        ctx.answerCbQuery();
                        yield (0, greeting_1.default)(ctx);
                    }
                }
            }
            if (ctx.updateType === 'message') {
                let amount = 0;
                // @ts-ignore
                if (ctx.message.text) {
                    // @ts-ignore
                    if (parseFloat(ctx.message.text) > 0 && parseFloat(ctx.message.text) < 60000) {
                        // @ts-ignore
                        amount = parseFloat(ctx.message.text);
                        // @ts-ignore
                    }
                    else if (parseFloat(ctx.message.text) > 60000) {
                        amount = 60000;
                    }
                }
                ctx.scene.session.amount = amount;
                let amount_message = `<b>Поддержка проекта 💰</b> \n\n`;
                if (amount) {
                    const currentDate = new Date();
                    const futureDate = (currentDate.getTime() + 0.2 * 60 * 60 * 1000);
                    let payment = yield new IPayment_1.Payment({
                        user_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
                        amount: ctx.scene.session.amount,
                        expirationDateTime: futureDate
                    }).save();
                    console.log(payment);
                    let link = yield get_link_for_payment(ctx, ctx.scene.session.amount, payment._id.toString(), payment.expirationDateTime);
                    amount_message += `Счёт сформирован на сумму ${(0, format_money_1.default)(ctx.scene.session.amount)} ₽\n`;
                    yield ctx.reply(amount_message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Оплатить',
                                        url: link.payUrl
                                    }
                                ],
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }
                                ]
                            ]
                        }
                    });
                }
                else {
                    yield ctx.reply(message, extra);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = help_handler;
function get_link_for_payment(ctx, amount, billID, expirationDateTime) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = {
                amount: amount.toFixed(2),
                currency: 'RUB',
                account: `${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id}`,
                expirationDateTime: expirationDateTime,
                comment: 'На сохранение бурятского яызыка',
                email: 'alexandrbnimaev@yandex.ru',
                successUrl: `https://5491-95-188-237-196.ngrok-free.app/payment/success?billId=${billID}`
            };
            let link = qiwiApi.createBill(billID, params);
            return link;
        }
        catch (err) {
            console.log(err);
        }
    });
}
//# sourceMappingURL=helpHandler.js.map