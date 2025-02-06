import mongoose, { Model, Schema } from 'mongoose';

const CacheSchema = new Schema<ICache>(
    {
        cache_key: { type: String, required: true, unique: true, index: true },
        value: { type: String, required: true },
        ttl: { type: Number, required: true },
    },
    { timestamps: true },
);

export const CacheModel: Model<ICache> = mongoose.models.Cache || mongoose.model<ICache>('Cache', CacheSchema);
