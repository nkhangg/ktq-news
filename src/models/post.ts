import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const PostSchema = new Schema<IPost>(
    {
        thumbnail: { type: String, required: true },
        title: { type: String, required: true, index: true },
        content: { type: String, required: true },
        preview_content: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        ttr: { type: Number, default: 300 },
        slug: { type: String, required: true, index: true },
        like_count: { type: Number, default: 0 },
    },
    { timestamps: true },
);

PostSchema.plugin(mongoosePaginate);

export const PostModel = mongoose.models.Post || mongoose.model<IPost, PaginateModel<IPost>>('Post', PostSchema);
