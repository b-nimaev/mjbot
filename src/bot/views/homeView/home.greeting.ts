import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"

export default async function greeting(ctx: rlhubContext) {

    console.log(ctx.update.message)

    const extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🚀 Сгенерировать", callback_data: "generate" },
                    { text: "✅ Тарифы", callback_data: "tarifs" }
                ],
            ]
        }
    }

    let message = `🤖 Привет, это бот от Midjorney доступный прямо в телеграм!\n\n`
    message += `Теперь ты можешь генерировать любые изображения по текстовому описанию не выходя из мессенджера!\n\n`
    message += `🌅 Чтобы создать картинку просто напишите свой запрос на английском. \n\n`
    message += `⛵️ Вам доступно 3 бесплатных запроса. \n\n`
    message += `🔑 Чтобы получить безлимитный доступ к боту MidJourney, есть несколько тарифов на выбор.`

    try {

        // ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : ctx.reply(message, extra)

    } catch (err) {
        console.log(err)
    }
}