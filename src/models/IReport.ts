import mongoose, { Schema, model, ObjectId, Date, Document } from "mongoose";

interface IReport extends Document {
    user_id: ObjectId,
    translation_id: ObjectId,
    message_id: number,
    expirationDateTime: Date
}

const Report = model<IReport>('Report', new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    translation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    message_id: { type: Number, required: true },
    expirationDateTime: {
        type: Date,
        expires: '10d',
        default: Date.now
    }
}));

export { Report, IReport }
