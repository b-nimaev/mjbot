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

const stage: any = new Scenes.Stage<rlhubContext>([home, vocabular, sentences, dashboard, moderation, settings], { default: 'home', ttl: 100000 });
bot.use(session())
bot.use(stage.middleware())