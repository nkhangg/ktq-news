import mongoose, { Model, Schema } from 'mongoose';

const SearchHistorySchema = new Schema<ISearchHistory>(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        search_count: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

export const SearchHistoryModel: Model<ISearchHistory> = mongoose.models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);
