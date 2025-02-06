import mongoose, { Model, Schema } from 'mongoose';

const HistorySchema = new Schema<IHistory>({
    ip_client: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

export const HistoryModel: Model<IHistory> = mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);
