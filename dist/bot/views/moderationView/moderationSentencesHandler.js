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
exports.moderation_sentences = exports.updateSentence = exports.moderation_sentences_handler = void 0;
const mongodb_1 = require("mongodb");
const ISentence_1 = require("../../../models/ISentence");
const greeting_1 = __importDefault(require("./greeting"));
function moderation_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let update = ctx.updateType;
            if (update === 'callback_query') {
                let data = ctx.update.callback_query.data;
                if (data === 'back') {
                    ctx.wizard.selectStep(0);
                    yield (0, greeting_1.default)(ctx);
                }
                if (data === 'good') {
                    yield updateSentence(ctx, 'accepted');
                }
                if (data === 'bad') {
                    yield updateSentence(ctx, 'declined');
                }
                ctx.answerCbQuery();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.moderation_sentences_handler = moderation_sentences_handler;
function updateSentence(ctx, value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ISentence_1.Sentence.findOneAndUpdate({ _id: new mongodb_1.ObjectId(ctx.session.__scenes.moderation_sentence) }, {
            $set: {
                'accepted': value
            }
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res) {
                if (res.accepted === 'accepted') {
                    ctx.answerCbQuery('Предложение принято ✅');
                }
                else if (res.accepted === 'declined') {
                    ctx.answerCbQuery('Предложение отправлено на рассмотрение');
                }
            }
        })).catch(err => {
            console.log(err);
        });
        yield moderation_sentences(ctx);
    });
}
exports.updateSentence = updateSentence;
function moderation_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Модерация — Предложения</b>`;
            if (ctx.updateType === 'callback_query') {
                ISentence_1.Sentence.findOne({
                    accepted: "not view"
                }).then((document) => __awaiter(this, void 0, void 0, function* () {
                    if (!document) {
                        yield ctx.answerCbQuery('Предложений не найдено');
                        ctx.wizard.selectStep(0);
                        yield (0, greeting_1.default)(ctx).catch(() => { ctx.answerCbQuery('Предложений не найдено'); });
                    }
                    else {
                        if (document._id) {
                            ctx.session.__scenes.moderation_sentence = document._id.toString();
                        }
                        let message = `<b>Модерация</b> \n\n`;
                        let extra = {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: '👍',
                                            callback_data: 'good'
                                        },
                                        {
                                            text: '👎',
                                            callback_data: 'bad'
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
                        };
                        const options = {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric', // секунды, например '33'
                        };
                        const formattedDate = document.createdAt.toLocaleDateString('ru-RU', options); // 'Пн, 21 апр. 2023'
                        // const formattedTime = document.createdAt.toLocaleTimeString('ru-RU', options); // '17:14:33'
                        message += `${document.text} \n`;
                        message += `<pre>${formattedDate}</pre>`;
                        yield ctx.editMessageText(message, extra);
                        ctx.wizard.selectStep(1);
                    }
                }));
                ctx.answerCbQuery();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.moderation_sentences = moderation_sentences;
//# sourceMappingURL=moderationSentencesHandler.js.map