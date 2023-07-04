import { Composer, Scenes } from "telegraf";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";
import greeting from "./homeView/home.greeting";

// handlers
import generate_handler from "./homeView/home.generateHandler";
import tarifs_handler from "./homeView/home.tarifsHandler";
import main_handler from "./homeView/home.mainHandler";

const handler = new Composer<rlhubContext>();
const home = new Scenes.WizardScene("home", handler, 
    async (ctx: rlhubContext) => await main_handler (ctx),
    async (ctx: rlhubContext) => await generate_handler (ctx),
    async (ctx: rlhubContext) => await tarifs_handler (ctx)
);

home.start(async (ctx: rlhubContext) => {
    try {

        // ищем пользователя в бд
        let document: IUser | null = await User.findOne({
            id: ctx.from?.id
        })

        // если его, нет, сто создаем
        if (!document) {
            
            if (ctx.from) {

                let user: IUser = {
                    id: ctx.from.id,
                    username: ctx.from.username,
                    first_name: ctx.from.first_name,
                    is_bot: false,
                    free_generations: 3
                }

                await new User(user).save().catch(err => {
                    console.error(err)
                })
                
                await greeting(ctx)
            
            }

        } else {
            
            // иначе выдаем стартовое меню 

            ctx.wizard.selectStep(1)
            await greeting(ctx)
        }

    } catch (err) {
        console.error(err)
    }
});


home.enter(async (ctx) => await greeting(ctx))

home.action(/\./, async (ctx) => {
    console.log(ctx)
    await greeting(ctx)
})

export default home
