import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { IUser, User } from "../../../models/IUser"
import rlhubContext from "../../models/rlhubContext"
import greeting from "./home.greeting"
import { generate_starting_section } from "./home.mainHandler"

async function send_status(ctx: rlhubContext) {
    try {

        // инициализируем данные для отправки
        // если человек отправил сообщение для генерации

        let message: string = `🎨 Я рисую, пожалуйста подождите...`
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Стоп', callback_data: 'stop' }]
                ]
            }
        }

        return await ctx.reply(message, extra)

    } catch (error) {

        console.error(error)
        return false

    }
}

export default async function generate_handler(ctx: rlhubContext) {

    if (ctx.updateType === "callback_query") {


        let data: 'generate' | 'tarifs' | 'back' = ctx.update.callback_query.data

        if (data === 'generate') {

            ctx.wizard.selectStep(2)

        } else if (data === 'tarifs') {

            ctx.wizard.selectStep(3)

        } else if (data === 'back') {

            ctx.wizard.selectStep(1)
            return await greeting(ctx)

        }

        ctx.answerCbQuery()

    } else if (ctx.updateType === 'message') {

        if (ctx.message.text) {

            let user: IUser | null = await User.findOne({ id: ctx.from?.id })

            if (user?.free_generations) {

                if (user.free_generations > 0) {

                    // Если у пользователя есть доступные заросы на генерацию
                    // отнимаем генерацию

                    await User.findOneAndUpdate({ id: ctx.from?.id }, { $set: { free_generations: user?.free_generations - 1 } })
                        .then(async (updated) => {

                            await send_status(ctx)

                        })
                        .catch(async (error) => console.error(error))

                }

            } else {

                await exists_generations(ctx)

            }

        }

    }

}

export async function exists_generations(ctx: rlhubContext) {

    // инициируем данные для отправки
    // если нет доступных генераций

    let message: string = `У вас нет доступных генераций!`
    let extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'back' }]
            ]
        }
    }

    // здесь релпаим сообщение, т.к. обратываем update type message 

    if (ctx.updateType === 'callback_query') {
        await ctx.editMessageText(message, extra)
            .catch(async (error) => console.error(error))
    } else {
        await ctx.reply(message, extra)
            .catch(async (error) => console.error(error))
    }

}