import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: 'admin' },
        fullname: { type: String, required: true },
    },
    { timestamps: true },
);

UserSchema.plugin(mongoosePaginate);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
