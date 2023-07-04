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
const stage = new telegraf_1.Scenes.Stage([home_scene_1.default, chat_scene_1.default, vocabular_scene_1.default, sentences_scene_1.default, dashboard_scene_1.default, moderation_scene_1.default, settings_scene_1.default], { default: 'home' });
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.bot.telegram.sendMessage(1272270574, '/start');
    }
    catch (err) {
        console.error(err);
    }
}))();
exports.bot.use((0, telegraf_1.session)());
exports.bot.use(stage.middleware());
exports.bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.scene.enter('home');
    // ctx.deleteMessage(874)
}));
exports.bot.command('chat', (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield ctx.scene.enter('chatgpt'); }));
exports.bot.command('home', (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield ctx.scene.enter('home'); }));
//# sourceMappingURL=index.js.map