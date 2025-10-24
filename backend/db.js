import mongoose from "mongoose";

const db = async () =>{
    try {
        console.log("hello")
        await mongoose.connect("mongodb+srv://ganeshjipatel108_db_user:FFj7vODfaGVoePNO@cluster0.rmu3unw.mongodb.net/",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB is connected successfully");
    } catch (error) {
        console.error('MongoDB connection Error', error.message )
    }
}


export default db;