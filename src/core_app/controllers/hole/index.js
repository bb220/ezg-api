const {Hole, Round}=require("../../../database/models")
const response = require("../../../utils/response")

module.exports={
    createHole:async(req,res,next)=>{
        try{
            const round_data=await Round.findOne({_id:req.body.round,is_deleted:false,user:req.user._id})
            if(!round_data)return response.errorResponse(res,404,"round not found")

            const new_hole=new Hole({...req.body,user:req.user._id})
            new_hole.user=round_data.user
            await new_hole.save()
            response.successResponse(res,"hole created",new_hole)
        }catch(e){
            next(e)
        }
    },
    getHoleList:async(req,res,next)=>{
        try{
            let { page = 1, limit = 10 ,round} = req.query
            limit = Number(limit)
            page = Number(page)
            const offset = (page - 1) * limit;            
            let condition = { is_deleted:false,user:req.user._id}

            if(round)condition.round=round

            const hole_list = await Hole.find(condition).sort({ createdAt: -1 }).populate("user","email").populate("round").limit(limit).skip(offset).select("-__v -is_deleted")

            const count_docs = await Hole.countDocuments(condition)
            let total_pages = Math.ceil(count_docs / limit)
            total_pages = total_pages === 0 ? 1 : total_pages

            return response.successResponse(res, null, hole_list, page, total_pages)
        }catch(e){
            next(e)
        }
    },
    getSingleHole:async(req,res,next)=>{
        try{
            const {hole_id}=req.params
            const hole_data=await Hole.findOne({_id:hole_id,is_deleted:false,user:req.user._id}).sort({ createdAt: -1 }).populate("user","email").populate("round").select("-__v -is_deleted")
            if(!hole_data) return response.errorResponse(res,404,"hole not found")

            response.successResponse(res,null,hole_data)
        }catch(e){
            next(e)
        }
    },

    updateHole:async(req,res,next)=>{
        try{
            const {hole_id}=req.params
            const hole_data=await Hole.findOne({_id:hole_id,is_deleted:false,user:req.user._id})
            if(!hole_data) return response.errorResponse(res,404,"hole not found")

            const round_data=await Round.findOne({_id:req.body.round,is_deleted:false,user:req.user._id})
            if(!round_data)return response.errorResponse(res,404,"round not found")

            const updates=Object.keys(req.body)
            updates.forEach((obj)=>{
                hole_data[obj]=req.body[obj]
            })
            await hole_data.save()
            response.successResponse(res,"hole updated",hole_data)
        }catch(e){
            next(e)
        }
    },
    deleteHole:async(req,res,next)=>{
        try{
            const {hole_id}=req.params
            const hole_data=await Hole.findOne({_id:hole_id,is_deleted:false,user:req.user._id})
            if(!hole_data) return response.errorResponse(res,404,"hole not found")

            hole_data.is_deleted=true
            await hole_data.save()

            response.successResponse(res,"hole deleted",null)
         }catch(e){
            next(e)
        }
    },
}