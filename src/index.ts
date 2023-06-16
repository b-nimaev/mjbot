import dotenv from 'dotenv';
import rlhubContext from './bot/models/rlhubContext';
import { Scenes, Telegraf, session } from 'telegraf';
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';
const OPENAI_API_KEY = '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';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
};
const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);
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
import chat from './bot/views/chat.scene';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';

const stage: any = new Scenes.Stage<rlhubContext>([home, chat, vocabular, sentences, dashboard, moderation, settings], { default: 'home', ttl: 100000 });
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
                [{ text: "🔐 Chat GPT", callback_data: "chatgpt" }],
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