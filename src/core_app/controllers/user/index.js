const response = require("../../../utils/response")
const { User } = require("../../../database/models")
const authMiddleware = require("../../../middleware/auth")

module.exports = {
    createAccount: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })

            if(user){
                if(user.is_deleted===true){
                    user.password=password
                    user.is_deleted=false
                    await user.save()
                    return response.successResponse(res, "User account has been created", null)
                }else{
                    return response.errorResponse(res, 400, "An account with this email already exists")
                }
            }

            const new_user = new User(req.body)
            await new_user.save()

            response.successResponse(res, "User account has been created", null)
        } catch (e) {
            next(e)
        }
    },

    loginWithEmail: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email ,is_deleted:false})
            if (!user) {
                return response.errorResponse(res, 404, "User not found")
            }

            const valid_pass = await user.passowrdCheck(password)
            if (!valid_pass) {
                return res.status(400).send({ status: false, code: 400, message: "invalid password" });
            }

            user.last_login = new Date()
            await user.save()
            const token = authMiddleware.generateNewToken(user)

            let user_data = {
                _id: user._id, token: token, email: user.email
            }


            response.successResponse(res, null, user_data)
        } catch (e) {
            next(e)
        }
    },
    getUserList: async (req, res, next) => {
        try {
            let { page = 1, limit = 10 ,search} = req.query
            limit = Number(limit)
            page = Number(page)
            const offset = (page - 1) * limit;            
            let condition = { is_deleted:false}

            if(search){
                condition = {...condition,$or:[ {email:{ $regex: search, $options: 'si' }}] } 
            }

            const user_list = await User.find(condition).sort({ createdAt: -1 }).limit(limit).skip(offset).select("email createdAt updatedAt")

            const count_docs = await User.countDocuments(condition)
            let total_pages = Math.ceil(count_docs / limit)
            total_pages = total_pages === 0 ? 1 : total_pages

            return response.successResponse(res, null, user_list, page, total_pages)

        } catch (e) {
            next(e)
        }
    },
    deleteUser:async(req,res,next)=>{
        try{
            const {user_id}=req.params
            const user_data=await User.findOne({_id:user_id,is_deleted:false})
            if(!user_data)return response.errorResponse(res,404,"user not found")

            user_data.is_deleted=true

            await user_data.save()

            return response.successResponse(res,"user deleted",null)
        }catch(e){
            next(e)
        }
    },
    updateAccount:async(req,res,next)=>{
        try{
            const {user_id}=req.params
            const{email,password}=req.body
            const user_data=await User.findOne({_id:user_id,is_deleted:false})
            if(!user_data)return response.errorResponse(res,404,"user not found")

            user_data.email=email
            user_data.password=password

            await user_data.save()

            return response.successResponse(res,"user data updated",null)
        }catch(e){
            next(e)
        }
    },
}