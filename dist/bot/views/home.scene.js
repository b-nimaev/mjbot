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
const telegraf_1 = require("telegraf");
const IUser_1 = require("../../models/IUser");
const home_greeting_1 = __importDefault(require("./homeView/home.greeting"));
// handlers
const home_generateHandler_1 = __importDefault(require("./homeView/home.generateHandler"));
const home_tarifsHandler_1 = __importDefault(require("./homeView/home.tarifsHandler"));
const home_mainHandler_1 = __importDefault(require("./homeView/home.mainHandler"));
const handler = new telegraf_1.Composer();
const home = new telegraf_1.Scenes.WizardScene("home", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, home_mainHandler_1.default)(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, home_generateHandler_1.default)(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, home_tarifsHandler_1.default)(ctx); }));
home.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // ищем пользователя в бд
        let document = yield IUser_1.User.findOne({
            id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
        });
        // если его, нет, сто создаем
        if (!document) {
            if (ctx.from) {
                let user = {
                    id: ctx.from.id,
                    username: ctx.from.username,
                    first_name: ctx.from.first_name,
                    is_bot: false,
                    free_generations: 3
                };
                yield new IUser_1.User(user).save().catch(err => {
                    console.error(err);
                });
                yield (0, home_greeting_1.default)(ctx);
            }
        }
        else {
            // иначе выдаем стартовое меню 
            ctx.wizard.selectStep(1);
            yield (0, home_greeting_1.default)(ctx);
        }
    }
    catch (err) {
        console.error(err);
    }
}));
home.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, home_greeting_1.default)(ctx); }));
home.action(/\./, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx);
    yield (0, home_greeting_1.default)(ctx);
}));
exports.default = home;
//# sourceMappingURL=home.scene.js.map