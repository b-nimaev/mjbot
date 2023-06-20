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
exports.add_sentences_handler = void 0;
const ISentence_1 = require("../../../models/ISentence");
const IUser_1 = require("../../../models/IUser");
const greeting_1 = __importDefault(require("./greeting"));
function add_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.answerCbQuery();
        ctx.wizard.selectStep(2);
        let message = `<b>Добавление перевода — Предложения</b>\n\n`;
        message += `Отправьте предложение на русском языке, которое <b>мы все вместе</b> переведем \n\n`;
        message += `<code>Можно загружать сразу несколько предложений, с разделением %%</code> \n\n`;
        message += `например \n`;
        message += `<code>Предложение 1 %% Предложение 2 %% Предложение 3 ...</code>`;
        yield ctx.editMessageText(message, {
            parse_mode: 'HTML', reply_markup: {
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
    });
}
exports.default = add_sentences;
function add_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.from) {
            try {
                if (ctx.updateType === 'callback_query') {
                    if (ctx.callbackQuery) {
                        // @ts-ignore
                        if (ctx.callbackQuery.data) {
                            // @ts-ignore
                            let data = ctx.callbackQuery.data;
                            // сохранение предложенных предложений
                            if (data === 'send_sentences') {
                                for (let i = 0; i < ctx.session.sentences.length; i++) {
                                    let sentence = {
                                        text: ctx.session.sentences[i],
                                        author: ctx.from.id,
                                        translations: [],
                                        accepted: 'not view',
                                        skipped_by: [],
                                        active_translator: [],
                                    };
                                    new ISentence_1.Sentence(sentence).save().then((data) => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        let object_id = data._id;
                                        yield IUser_1.User.findOneAndUpdate({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
                                            $push: {
                                                "proposedProposals": object_id
                                            }
                                        });
                                    }));
                                }
                                yield ctx.answerCbQuery(`${ctx.session.sentences} отправлены на проверку, спасибо!`);
                                ctx.wizard.selectStep(0);
                                yield (0, greeting_1.default)(ctx);
                            }
                            if (data === 'back') {
                                ctx.wizard.selectStep(0);
                                yield ctx.answerCbQuery();
                                return (0, greeting_1.default)(ctx);
                            }
                        }
                    }
                }
                else if (ctx.updateType === 'message') {
                    // @ts-ignore
                    if (ctx.message.text) {
                        // @ts-ignore
                        let text = ctx.message.text;
                        let user_id = ctx.from.id;
                        let sentence = {
                            text: text.toLocaleLowerCase(),
                            author: user_id,
                            translations: [],
                            accepted: 'not view',
                            skipped_by: [],
                            active_translator: [],
                        };
                        let message = ``;
                        if (sentence.text.indexOf('%%') !== -1) {
                            let splitted = sentence.text.split('%%');
                            let arr = [];
                            for (let i = 0; i < splitted.length; i++) {
                                arr.push(splitted[i].trimEnd().trimStart());
                            }
                            ctx.session.sentences = arr;
                            for (let i = 0; i < splitted.length; i++) {
                                message += `${i + 1}) ${splitted[i].trimStart().trimEnd()}\n`;
                            }
                        }
                        else {
                            ctx.session.sentences = [text];
                            message += text;
                        }
                        yield ctx.reply(message, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Сохранить',
                                            callback_data: 'send_sentences'
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Отмена',
                                            callback_data: 'back'
                                        }
                                    ]
                                ]
                            }
                        });
                    }
                    else {
                        yield ctx.reply("Нужно отправить в текстовом виде");
                    }
                }
            }
            catch (err) {
                ctx.wizard.selectStep(0);
                yield (0, greeting_1.default)(ctx);
            }
        }
    });
}
exports.add_sentences_handler = add_sentences_handler;
//# sourceMappingURL=addSentences.js.map