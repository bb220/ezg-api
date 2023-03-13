const {Round,User}=require("../../../database/models")
const response = require("../../../utils/response")

module.exports={
    createRound:async(req,res,next)=>{
        try{
            const user_data=await User.findOne({_id:req.body.user,is_deleted:false})
            if(!user_data)return response.errorResponse(res,404,"user not found")

            const new_round=new Round(req.body)
            await new_round.save()
            let round_data = {
                _id: new_round._id,
                name: new_round.name
            }

            response.successResponse(res,"round created",round_data)
        }catch(e){
            next(e)
        }
    },
    getRoundList:async(req,res,next)=>{
        try{
            let { page = 1, limit = 10 ,search} = req.query
            limit = Number(limit)
            page = Number(page)
            const offset = (page - 1) * limit;            
            let condition = { is_deleted:false}

            if(search){
                condition = {...condition,$or:[ {name:{ $regex: search, $options: 'si' }}] } 
            }

            const round_list = await Round.find(condition).sort({ createdAt: -1 }).populate("user","email").limit(limit).skip(offset).select("name played_date createdAt updatedAt")

            const count_docs = await Round.countDocuments(condition)
            let total_pages = Math.ceil(count_docs / limit)
            total_pages = total_pages === 0 ? 1 : total_pages

            return response.successResponse(res, null, round_list, page, total_pages)
        }catch(e){
            next(e)
        }
    },
    getSingleRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const round_data=await Round.findOne({_id:round_id,is_deleted:false}).populate("user","email").select("name played_date createdAt updatedAt")
            if(!round_data) return response.errorResponse(res,404,"round not found")

            response.successResponse(res,null,round_data)
        }catch(e){
            next(e)
        }
    },

    updateRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const round_data=await Round.findOne({_id:round_id,is_deleted:false})
            if(!round_data) return response.errorResponse(res,404,"round not found")

            const user_data=await User.findOne({_id:req.body.user,is_deleted:false})
            if(!user_data)return response.errorResponse(res,404,"user not found")

            const updates=Object.keys(req.body)
            updates.forEach((obj)=>{
                round_data[obj]=req.body[obj]
            })
            await round_data.save()
            response.successResponse(res,"round updated",null)
        }catch(e){
            next(e)
        }
    },
    deleteRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const round_data=await Round.findOne({_id:round_id,is_deleted:false})
            if(!round_data) return response.errorResponse(res,404,"round not found")

            round_data.is_deleted=true
            await round_data.save()
            response.successResponse(res,"round deleted",null)
         }catch(e){
            next(e)
        }
    },
}