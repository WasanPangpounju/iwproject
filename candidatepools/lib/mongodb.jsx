import mongoose from "mongoose";

export async function mongoDB(){
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("connected mongodb.")
    }catch(err){
        console.log("Connect mongodb failed !");
    }
}