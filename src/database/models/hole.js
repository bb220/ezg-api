const mongoose = require('mongoose')


const holeSchema = new mongoose.Schema({
    round:{ type: mongoose.Types.ObjectId, ref: "Round", required: true },
    user:{ type: mongoose.Types.ObjectId, ref: "User", required: true },
    number:{type:Number,required:true},
    par:{type:Number,default:0},
    score:{type:Number,required:true},
    putts:{type:Number,default:0},
    is_deleted:{type:Boolean,default:false}
},
    { timestamps: true })




const Hole = mongoose.model('Hole', holeSchema)

module.exports = Hole


