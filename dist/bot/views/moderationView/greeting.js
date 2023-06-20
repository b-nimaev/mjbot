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
Object.defineProperty(exports, "__esModule", { value: true });
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Модерация</b>\n\n`;
            message += `Секция`;
            message += `Выберите раздел чтобы приступить`;
            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Модерация предложений', callback_data: 'moderation_sentences' }],
                        [{ text: 'Модерация переводов', callback_data: 'moderation_translates' }],
                        [{ text: 'Модерация словаря', callback_data: 'moderation_vocabular' }],
                        [{ text: 'Назад', callback_data: 'back' }]
                    ]
                }
            };
            ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
            ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = greeting;
//# sourceMappingURL=greeting.js.map