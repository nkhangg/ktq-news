import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

CategorySchema.plugin(mongoosePaginate);

export const CategoryModel: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
