const mongoose = require('mongoose')


const courseHoleSchema = new mongoose.Schema({
    course:{ type: mongoose.Types.ObjectId, ref: "Course", required: true,index:true },
    user:{ type: mongoose.Types.ObjectId, ref: "User", required: true ,index:true },
    number:{type:Number,required:true,index:true },
    par:{type:Number,default:0},
    is_deleted:{type:Boolean,default:false}
},
    { timestamps: true })




const CourseHole = mongoose.model('CourseHole', courseHoleSchema)

module.exports = CourseHole


