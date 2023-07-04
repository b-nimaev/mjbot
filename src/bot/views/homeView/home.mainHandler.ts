import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"
import { IUser, User } from "../../../models/IUser"
import greeting from "./home.greeting"
import { exists_generations } from "./home.generateHandler"

export default async function main_handler(ctx: rlhubContext) {

    if (ctx.updateType === "callback_query") {


        let data: 'generate' | 'tarifs' | 'back' = ctx.update.callback_query.data

        if (data === 'generate') {
            
            await generate_starting_section(ctx)
 
        } else if (data === 'tarifs') {

            ctx.wizard.selectStep(3)

        } else if (data === 'back') {
            ctx.wizard.selectStep(1)
            await greeting(ctx)
        }

        ctx.answerCbQuery()

    }

}

export async function generate_starting_section(ctx: rlhubContext) {
            
    let document: IUser | null = await User.findOne({
        id: ctx.from?.id
    })
    
    if (document) {
        
        let message: string = `⛵️Осталось `
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Назад', callback_data: 'back' }]
                ]
            }
        }

        console.log(document)

        if (document.free_generations) {

            if (document.free_generations > 0) {
                
                message += `${document.free_generations}/3 генерация \n\n`
                message += `Отправь текст на Английском с описанием картинки, которую хочешь сгенерировать 🪄\n\n`
                message += `Выбор стилей, негативного промта и размера картинки будет в следующем шаге.`
    
                await ctx.editMessageText(message, extra)
    
                ctx.wizard.selectStep(2)
            
            }
            
        } else {
            
            await exists_generations(ctx)
        
        }

    } else {

        ctx.wizard.selectStep(0)
        return await greeting(ctx)
    
    }

} 