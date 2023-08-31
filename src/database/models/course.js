const mongoose = require('mongoose')


const courseSchema = new mongoose.Schema({
    user:{ type: mongoose.Types.ObjectId, ref: "User", required: true ,index:true },
    name:{type:String,required:true,trim:true },
    is_deleted:{type:Boolean,default:false}
},
    { timestamps: true })




const Course = mongoose.model('Course', courseSchema)

module.exports = Course
