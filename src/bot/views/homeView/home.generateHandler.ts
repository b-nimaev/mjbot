import rlhubContext from "../../models/rlhubContext"

export default async function generate_handler(ctx: rlhubContext) {

    if (ctx.updateType === "callback_query") {


        let data: 'generate' | 'tarifs' = ctx.update.callback_query.data

        if (data === 'generate') {

            ctx.wizard.selectStep(2)

        } else if (data === 'tarifs') {

            ctx.wizard.selectStep(3)

        }

        ctx.answerCbQuery()

    }

}