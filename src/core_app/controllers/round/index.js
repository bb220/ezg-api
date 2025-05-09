const {Round,User, Hole, Course}=require("../../../database/models")
const response = require("../../../utils/response")

module.exports={
    createRound:async(req,res,next)=>{
        try{
            const {course}=req.body
            if(course){
                const course_data=await Course.findOne({_id:course,is_deleted:false,user:req.user._id})
                if(!course_data) return response.errorResponse(res,404,"course not found")
            }

            const new_round=new Round({...req.body,user:req.user._id})
            await new_round.save()


            response.successResponse(res,"round created",new_round)
        }catch(e){
            next(e)
        }
    },
    getRoundList: async (req, res, next) => {
        try {
            let { page = 1, limit = 10, search } = req.query;
            limit = Number(limit);
            page = Number(page);
            const offset = (page - 1) * limit;
            let condition = { user: req.user._id, is_deleted: false };
    
            if (search) {
                condition = { ...condition, $or: [{ name: { $regex: search, $options: 'si' }}] };
            }
    
            const round_list = await Round.aggregate([
                { $match: condition },
                {
                    $lookup: {
                        from: "courses",
                        localField: "course",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                {
                    $unwind: {
                        path: "$course",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "courseholes",
                        localField: "course._id",
                        foreignField: "course",
                        pipeline: [
                            { $match:
                               { is_deleted: { $ne: true } }
                            }
                         ],
                        as: "course_holes"
                    }
                },
                {
                    $addFields: {
                        "course.total": { $sum: "$course_holes.par" }
                    }
                },
                { $project: { course_holes: 0 } },
                {
                    $lookup: {
                        from: "users", 
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                { $sort: { createdAt: -1 } },
                { $skip: offset },
                { $limit: limit },
                {
                    $project: {
                        name: 1,
                        user:{
                            _id: "$user._id",
                            email: "$user.email"
                        },
                        course: {
                            _id: "$course._id",
                            name: "$course.name",
                            total: "$course.total"
                        },
                        played_date: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
    
            const count_docs = await Round.countDocuments(condition);
            let total_pages = Math.ceil(count_docs / limit);
            total_pages = total_pages === 0 ? 1 : total_pages;
            round_list.forEach((round)=>{
                if(round.course._id===undefined){
                    round.course=null
                }
            })
    
            return res.send({
                status: true,
                code: 200,
                message: null,
                current_page: page,
                total_pages,
                total_rounds: count_docs,
                data: round_list
            });
        } catch (e) {
            next(e);
        }
    },
    getSingleRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const round_data=await Round.findOne({_id:round_id,user:req.user._id,is_deleted:false}).populate("user","email").select("name course played_date createdAt updatedAt")
            if(!round_data) return response.errorResponse(res,404,"round not found")

            response.successResponse(res,null,round_data)
        }catch(e){
            next(e)
        }
    },

    updateRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const {course}=req.body

            if(course){
                const course_data=await Course.findOne({_id:course,is_deleted:false,user:req.user._id})
                if(!course_data) return response.errorResponse(res,404,"course not found")
            }

            const round_data=await Round.findOne({_id:round_id,is_deleted:false,user:req.user._id})
            if(!round_data) return response.errorResponse(res,404,"round not found")

            const updates=Object.keys(req.body)
            updates.forEach((obj)=>{
                round_data[obj]=req.body[obj]
            })
            await round_data.save()
            response.successResponse(res,"round updated",round_data)
        }catch(e){
            next(e)
        }
    },
    deleteRound:async(req,res,next)=>{
        try{
            const {round_id}=req.params
            const round_data=await Round.findOne({_id:round_id,is_deleted:false,user:req.user._id})
            if(!round_data) return response.errorResponse(res,404,"round not found")

            round_data.is_deleted=true
            await round_data.save()

            await Hole.updateMany({round:round_id},{is_deleted:true})

            response.successResponse(res,"round deleted",null)
         }catch(e){
            next(e)
        }
    },
}