import mongoose, { Schema, model, ObjectId, Date, Document } from "mongoose";

interface IChat {
    user_id: ObjectId,
    name: string,
    context?: string
}

const ChatModel = model<IChat>('Chat', new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true },
    context: { type: String, required: false }
}));

export { ChatModel, IChat }
