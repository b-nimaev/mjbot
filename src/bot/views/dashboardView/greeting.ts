import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { IUser, User } from "../../../models/IUser"
import rlhubContext from "../../models/rlhubContext"
import format_money from "../../utlis/format_money"

export default async function greeting(ctx: rlhubContext) {
    try {

        if (ctx.from) {
            console.log(await User.find())
            let user: IUser | null = await User.findOne({ id: ctx.from.id })
            console.log(user)

            if (user) {

                const extra: ExtraEditMessageText = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'О проекте',
                                    callback_data: 'about'
                                }
                            ], [
                                {
                                    text: 'Поддержка проекта',
                                    callback_data: 'help'
                                }
                            ],
                            [
                                {
                                    text: 'Персональные данные',
                                    callback_data: 'common_settings'
                                }
                            ],
                            [
                                {
                                    text: 'Справочные материалы',
                                    callback_data: 'reference_materials'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: 'home'
                                },
                                {
                                    text: 'Обратная связь',
                                    url: 'https://t.me/bur_live'
                                }
                            ],
                        ]
                    }
                }

                let words = []
                let message: string = `<b>Личный кабинет</b> \n\n`
                message += `Общий рейтинг: ${user.rating} \n`
                // message += `Добавлено слов: 0 \n`
                // message += `Слов на модерации: ${words.length} \n`
                message += `Предложено предложений для перевода: ${user.proposedProposals.length}\n`

                message += `Количество переведенных предложений: 0 \n`
                message += `Количество голосов за перевод: ${user.voted_translations.length}`

                message += `\n\n<b>Внесено в проект ${format_money(user.supported)} ₽</b>`

                ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
                ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

            } else {
                console.log('123')
            }
        }

    } catch (err) {
        console.error(err);
    }
}