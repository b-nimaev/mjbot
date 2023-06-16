import dotenv from 'dotenv';
import rlhubContext from './bot/models/rlhubContext';
import { Scenes, Telegraf, session } from 'telegraf';

dotenv.config()
export const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);

import './app'
import './webhook'
import './database'

import home, { greeting } from './bot/views/home.scene';
import sentences from './bot/views/sentences.scene';
import settings from './bot/views/settings.scene';
import dashboard from './bot/views/dashboard.scene';
import vocabular from './bot/views/vocabular.scene';
import moderation from './bot/views/moderation.scene';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';

const stage: any = new Scenes.Stage<rlhubContext>([home, vocabular, sentences, dashboard, moderation, settings], { default: 'home', ttl: 100000 });
(async () => {
    const extra: ExtraEditMessageText = {
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
                [{ text: "Личный кабинет", callback_data: "dashboard" }]
            ]
        }
    }

    let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`
    message += '\n\nВыберите раздел, чтобы приступить'

    try {

        // ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        // ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : ctx.reply(message, extra)
        bot.telegram.sendMessage(1272270574, message, extra)

    } catch (err) {
        console.log(err)
    }
})();
bot.use(session())
bot.use(stage.middleware())