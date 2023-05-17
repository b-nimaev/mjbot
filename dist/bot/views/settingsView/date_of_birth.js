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
exports.date_birth = void 0;
const greeting_1 = __importDefault(require("./greeting"));
function date_birth_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let update = ctx.updateType;
            if (update === 'message') {
                return yield date_birth(ctx);
            }
            if (update === 'callback_query') {
                let data = ctx.update.callback_query.data;
                if (data === 'back') {
                    ctx.wizard.selectStep(0);
                    yield (0, greeting_1.default)(ctx);
                }
                ctx.answerCbQuery(data);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = date_birth_handler;
function date_birth(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = 'Настройки / Дата рождения \n\n';
            message += 'Выберите месяц рождения';
            let extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Январь', callback_data: 'January' },
                            { text: 'Февраль', callback_data: 'February' },
                            { text: 'Март', callback_data: 'March' }
                        ],
                        [
                            { text: 'Апрель', callback_data: 'April' },
                            { text: 'Май', callback_data: 'May' },
                            { text: 'Июнь', callback_data: 'June' }
                        ],
                        [
                            { text: 'Июль', callback_data: 'July' },
                            { text: 'Август', callback_data: 'August' },
                            { text: 'Сентябрь', callback_data: 'September' }
                        ],
                        [
                            { text: 'Октябрь', callback_data: 'October' },
                            { text: 'Ноябрь', callback_data: 'November' },
                            { text: 'Декабрь', callback_data: 'December' }
                        ],
                        [{ text: 'Назад', callback_data: 'back' }]
                    ]
                }
            };
            yield ctx.editMessageText(message, extra);
            ctx.wizard.selectStep(1);
            return ctx.answerCbQuery();
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.date_birth = date_birth;
//# sourceMappingURL=date_of_birth.js.map