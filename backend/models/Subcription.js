import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    endpoint:{
        type:String,
        require:true
    },
    key:{
        type:Object,
        require:true
    }
},{timeseries:true})


module.exports = mongoose.model('Subscription',SubscriptionSchema)