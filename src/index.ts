import dotenv from 'dotenv';
import rlhubContext from './bot/models/rlhubContext';
import { Scenes, Telegraf, session } from 'telegraf';
dotenv.config()

export const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);

import './app'
import './webhook'
import './database'

import home from './bot/views/home.scene';
import sentences from './bot/views/sentences.scene';
import settings from './bot/views/settings.scene';
import dashboard from './bot/views/dashboard.scene';
import vocabular from './bot/views/vocabular.scene';
import moderation from './bot/views/moderation.scene';
import chat from './bot/views/chat.scene';
import { Translation, voteModel } from './models/ISentence';

const stage: any = new Scenes.Stage<rlhubContext>([home, chat, vocabular, sentences, dashboard, moderation, settings], { default: 'home' });

(async () => {
    try {

        bot.telegram.sendMessage(1272270574, '/start')

    } catch (err) {
        console.error(err)
    }
})();

bot.use(session())
bot.use(stage.middleware())
bot.start(async (ctx) => {
    await ctx.scene.enter('home')
    // ctx.deleteMessage(874)
})

bot.command('chat', async (ctx) => { await ctx.scene.enter('chatgpt') })
bot.command('home', async (ctx) => { await ctx.scene.enter('home') })