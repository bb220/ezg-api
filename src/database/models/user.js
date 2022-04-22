const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,trim:true},
    last_login:{type:Date,default:new Date()},
    is_deleted:{type:Boolean,default:false}
},
    { timestamps: true })


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.passowrdCheck = async function (password) {
    const user = this;
    const result = await bcrypt.compare(password, user.password);
    return result;
};


const User = mongoose.model('User', userSchema)

module.exports = User


