import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1);  // ---> exit the process with a failure code
    }
}

export default connectDB