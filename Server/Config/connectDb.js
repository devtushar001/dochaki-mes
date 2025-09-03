import mongoose from "mongoose";

const connectDb = async (mongo_url) => {
    try {
        const conn = await mongoose.connect(mongo_url);
    } catch (error) {
        process.exit(1);
    }
};

export default connectDb;
