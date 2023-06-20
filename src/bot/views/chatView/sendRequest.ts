import { Configuration, OpenAIApi } from "openai";
import rlhubContext from "../../models/rlhubContext";
import { ObjectId } from "mongoose";
import { ChatModel } from "../../../models/IChat";
import dotenv from 'dotenv';
dotenv.config()
const configuration = new Configuration({
    apiKey: process.env.apikey,
});

const openai = new OpenAIApi(configuration);

export async function sendRequest(ctx: rlhubContext) {
    try {

        let current_chat: ObjectId = ctx.scene.session.current_chat
        let old = await ChatModel.findById(current_chat)
        let chat = await ChatModel.findOneAndUpdate({
            _id: current_chat
        }, {
            $set: {
                context: old?.context + '/n' + ctx.update.message.text.trim()
            }
        })

        let newDoc = await ChatModel.findById(current_chat)

        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: .1,
            // @ts-ignore
            messages: [{ role: "user", content: newDoc?.context.trim() }],
        });

        return chatCompletion
        // chatCompletion.data.choices[0].message?.content
    } catch (err) {
        console.error(err)
    }
}