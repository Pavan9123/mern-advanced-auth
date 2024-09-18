import mongoose from "mongoose";



export const connectDB = async () => {
    try {
        
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        return console.log(`MongoDB Connected: ${connect.connection.host}`)

    } catch (error) {
        console.log('error connection to MongoDB:', error.message);
        process.exit(1)
    }
    
}