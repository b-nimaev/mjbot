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
import chat from './bot/views/chat.scene';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { Translation, voteModel } from './models/ISentence';
import { User } from './models/IUser';

const stage: any = new Scenes.Stage<rlhubContext>([home, chat, vocabular, sentences, dashboard, moderation, settings], { default: 'home' });
// (async () => {
//     const extra: ExtraEditMessageText = {
//         parse_mode: 'HTML',
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     { text: "Самоучитель", callback_data: "study" },
//                     { text: "Словарь", callback_data: "vocabular" }
//                 ],
//                 [{ text: 'Предложения', callback_data: 'sentences' }],
//                 [{ text: 'Переводчик', callback_data: 'translater' }],
//                 [{ text: 'Модерация', callback_data: 'moderation' }],
//                 [{ text: "🔐 Chat GPT", callback_data: "chatgpt" }],
//                 [{ text: "Личный кабинет", callback_data: "dashboard" }]
//             ]
//         }
//     }

//     let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`
//     message += '\n\nВыберите раздел, чтобы приступить'

//     try {

//         let users = await User.find()
//         users.forEach(async (element) => {
//             if (element.id) {
//                 try {
//                     await bot.telegram.sendMessage(`${element.id}`, message, extra)
//                 } catch (err) {
//                     console.log(err)
//                 }
//             }
//         });
        
//         // ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
//         // ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : ctx.reply(message, extra)
//         // bot.telegram.sendMessage(1272270574, message, extra)

//     } catch (err) {

//         console.log(err)

//     }
// })();


(async () => {
    try {

        bot.telegram.sendMessage(1272270574, 'бот запущен!')

    } catch (err) {
        console.error(err)
    }
})

home.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
chat.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
vocabular.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
sentences.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
dashboard.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
moderation.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })
settings.command('chat', async (ctx: rlhubContext) => { await ctx.scene.enter('chatgpt') })

home.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
chat.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
vocabular.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
sentences.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
dashboard.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
moderation.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })
settings.command('home', async (ctx: rlhubContext) => { await ctx.scene.enter('home') })


bot.use(session())
bot.use(stage.middleware())
bot.start(async (ctx) => {
    await ctx.scene.enter('home')
    // ctx.deleteMessage(874)
})
bot.command('update_translates_collection', async (ctx) => {

    let translates = await Translation.find()
    translates.forEach(async (element: any) => {

        let votes = element.votes
        let rating = 0

        if (votes) {

            let pluses = 0
            let minuses = 0

            for (let i = 0; i < votes.length; i++) {

                let voteDocument = await voteModel.findById(votes[i])

                if (voteDocument) {

                    if (voteDocument.vote === true) {
                        pluses++
                    } else {
                        minuses++
                    }

                }

            }

            rating = pluses - minuses
        }

        await Translation.findByIdAndUpdate(element._id, {
            $set: {
                rating: rating
            }
        })
    })

});

bot.command('chat', async (ctx) => { await ctx.scene.enter('chatgpt') })
bot.command('home', async (ctx) => { await ctx.scene.enter('home') })