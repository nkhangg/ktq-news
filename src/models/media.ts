import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const MediaSchema = new Schema<IMedia>(
    {
        original_url: { type: String, required: false, default: null },
        cloud_data: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true },
);

MediaSchema.plugin(mongoosePaginate);

export const MediaModel: Model<IMedia> = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
