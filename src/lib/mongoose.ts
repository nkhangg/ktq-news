import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return true;
    }

    try {
        await mongoose.connect(MONGO_URI || '', {
            dbName: 'ktq-news',
        });

        // mongoose.set('strictPopulate', false);
        return true;
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
