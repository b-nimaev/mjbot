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
exports.my_sentences_handler = void 0;
const mongodb_1 = require("mongodb");
const ISentence_1 = require("../../../models/ISentence");
const IUser_1 = require("../../../models/IUser");
const greeting_1 = __importDefault(require("./greeting"));
const timezone = 'Asia/Shanghai'; // ваш часовой пояс
function my_sentences(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Статистика</b> \n\n`;
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
            message += `Здесь будут отображаться ваша статисика по работе с предложениями\n\n`;
            let user = yield IUser_1.User.findOne({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
            let props_obj = {
                accepted: [],
                declined: [],
                not_view: []
            };
            if (user) {
                let props = user.proposedProposals;
                if (props) {
                    for (let i = 0; i < props.length; i++) {
                        let sentence = yield ISentence_1.Sentence.findOne({ _id: new mongodb_1.ObjectId(props[i]) });
                        if (sentence) {
                            if (sentence.accepted === 'accepted') {
                                props_obj.accepted.push(sentence);
                            }
                            if (sentence.accepted === 'declined') {
                                props_obj.declined.push(sentence);
                            }
                            if (sentence.accepted === 'not view') {
                                props_obj.not_view.push(sentence);
                            }
                        }
                    }
                }
            }
            message += `Отправлено предложений: ${props_obj.not_view.length + props_obj.accepted.length + props_obj.declined.length}\n`;
            message += `Принято предложений: ${props_obj.accepted.length}\n`;
            message += `Отклонено предложений: ${props_obj.declined.length}\n`;
            message += `Предложений на рассмотрении: ${props_obj.not_view.length}`;
            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery();
                yield ctx.editMessageText(message, extra);
            }
            else {
                yield ctx.reply(message, extra);
            }
            ctx.wizard.selectStep(1);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = my_sentences;
function my_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {
                    //@ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === "back") {
                            ctx.wizard.selectStep(0);
                            yield (0, greeting_1.default)(ctx);
                        }
                    }
                }
            }
            else {
                yield my_sentences(ctx);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.my_sentences_handler = my_sentences_handler;
//# sourceMappingURL=mySentences.js.map