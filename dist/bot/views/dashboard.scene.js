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
const greeting_1 = __importDefault(require("./dashboardView/greeting"));
const helpHandler_1 = __importDefault(require("./dashboardView/helpHandler"));
const handler = new telegraf_1.Composer();
const dashboard = new telegraf_1.Scenes.WizardScene("dashboard", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield about_project(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, helpHandler_1.default)(ctx); }));
dashboard.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, greeting_1.default)(ctx); }));
dashboard.action("common_settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery('Личный кабинет / Настройки');
    return ctx.scene.enter('settings');
}));
function about_project(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {
                    // @ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === 'back') {
                            ctx.wizard.selectStep(0);
                            yield ctx.answerCbQuery();
                            yield (0, greeting_1.default)(ctx);
                        }
                    }
                }
            }
            else {
                about_project_section_render(ctx);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
dashboard.action("about", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield about_project_section_render(ctx); }));
function about_project_section_render(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = '<b>Личный кабинет — О проекте</b> \n\nНаш проект нацелен на развитие бурятского языка, который является важной частью культурного наследия Бурятии. \n\nМы стремимся сохранить и продвигать язык среди молодого поколения, создавая образовательные материалы и организуя языковые мероприятия. \n\nНаша цель - сохранить богатство бурятской культуры и ее языка для будущих поколений.';
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
                yield ctx.editMessageText(message, extra);
                ctx.answerCbQuery();
                ctx.wizard.selectStep(1);
            }
            else {
                yield ctx.reply(message, extra);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
handler.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, greeting_1.default)(ctx); }));
dashboard.action('reference_materials', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery();
}));
dashboard.action("help", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield help(ctx); }));
function help(ctx) {
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
                yield ctx.editMessageText(message, extra);
            }
            ctx.wizard.selectStep(2);
        }
        catch (err) {
            console.log(err);
        }
    });
}
dashboard.action("home", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.scene.enter('home');
}));
dashboard.action("contact", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery('Обратная связь');
}));
exports.default = dashboard;
//# sourceMappingURL=dashboard.scene.js.map