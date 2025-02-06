import mongoose, { Model, Schema } from 'mongoose';

const LikeSchema = new Schema<ILike>(
    {
        ip_client: { type: String, required: true, index: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        action: { type: String, required: true },
    },
    { timestamps: true },
);

LikeSchema.index({ ip_client: 1, post: 1 }, { unique: true });

export const LikeModel: Model<ILike> = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
