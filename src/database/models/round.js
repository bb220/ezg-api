const mongoose = require('mongoose')


const roundSchema = new mongoose.Schema({
    user:{ type: mongoose.Types.ObjectId, ref: "User", required: true ,index:true },
    name:{type:String,trim:true,default:null},
    played_date:{type:Date,default:new Date()},
    is_deleted:{type:Boolean,default:false}
},
    { timestamps: true })




const Round = mongoose.model('Round', roundSchema)

module.exports = Round


