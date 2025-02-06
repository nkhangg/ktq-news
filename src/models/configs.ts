import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ConfigSchema = new Schema<IConfig>({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
});

ConfigSchema.plugin(mongoosePaginate);

export const ConfigModel: Model<IConfig> = mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);
