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
exports.bot = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const openai_1 = require("openai");
const OPENAI_API_KEY = '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';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
};
const configuration = new openai_1.Configuration({
    apiKey: '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',
});
const openai = new openai_1.OpenAIApi(configuration);
const data = {
    model: 'gpt-3.5-turbo-16k-0613',
    messages: [{ role: 'user', content: 'Say this is a test!' }],
    temperature: 0.2
};
// (async () => {
//     try {
//         const chatCompletion = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo",
//             temperature: .8,
//             messages: [{ role: "user", content: `дай 10 предложений на русском языке` }],
//         });
//         console.log(chatCompletion.data.choices[0].message);
//     } catch (err) {
//         console.error(err)
//     }
// })();
dotenv_1.default.config();
exports.bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
require("./app");
require("./webhook");
require("./database");
const home_scene_1 = __importDefault(require("./bot/views/home.scene"));
const sentences_scene_1 = __importDefault(require("./bot/views/sentences.scene"));
const settings_scene_1 = __importDefault(require("./bot/views/settings.scene"));
const dashboard_scene_1 = __importDefault(require("./bot/views/dashboard.scene"));
const vocabular_scene_1 = __importDefault(require("./bot/views/vocabular.scene"));
const moderation_scene_1 = __importDefault(require("./bot/views/moderation.scene"));
const chat_scene_1 = __importDefault(require("./bot/views/chat.scene"));
const stage = new telegraf_1.Scenes.Stage([home_scene_1.default, chat_scene_1.default, vocabular_scene_1.default, sentences_scene_1.default, dashboard_scene_1.default, moderation_scene_1.default, settings_scene_1.default], { default: 'home', ttl: 100000 });
(() => __awaiter(void 0, void 0, void 0, function* () {
    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Самоучитель", callback_data: "study" },
                    { text: "Словарь", callback_data: "vocabular" }
                ],
                [{ text: 'Предложения', callback_data: 'sentences' }],
                [{ text: 'Переводчик', callback_data: 'translater' }],
                [{ text: 'Модерация', callback_data: 'moderation' }],
                [{ text: "🔐 Chat GPT", callback_data: "chatgpt" }],
                [{ text: "Личный кабинет", callback_data: "dashboard" }]
            ]
        }
    };
    let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`;
    message += '\n\nВыберите раздел, чтобы приступить';
    try {
        // ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        // ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : ctx.reply(message, extra)
        exports.bot.telegram.sendMessage(1272270574, message, extra);
    }
    catch (err) {
        console.log(err);
    }
}))();
exports.bot.use((0, telegraf_1.session)());
exports.bot.use(stage.middleware());
//# sourceMappingURL=index.js.map