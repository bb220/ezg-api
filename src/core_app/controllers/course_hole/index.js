const {CourseHole, Course}=require("../../../database/models")
const response = require("../../../utils/response")

module.exports={
    createCourseHole:async(req,res,next)=>{
        try{
            const course_data=await Course.findOne({_id:req.body.course,is_deleted:false,user:req.user._id})
            if(!course_data)return response.errorResponse(res,404,"course not found")

            const new_course_hole=new CourseHole({...req.body,user:req.user._id})
            await new_course_hole.save()
            response.successResponse(res,"course hole created",new_course_hole)
        }catch(e){
            next(e)
        }
    },
    getCourseHoleList:async(req,res,next)=>{
        try{
            let { page = 1, limit = 10 ,course} = req.query
            limit = Number(limit)
            page = Number(page)
            const offset = (page - 1) * limit;            
            let condition = {user:req.user._id, is_deleted:false}

            
            if(course)condition.course=course

            const course_hole_list = await CourseHole.find(condition).sort({ createdAt: -1 }).populate("user","email").limit(limit).skip(offset).select("-isDeleted")

            const count_docs = await CourseHole.countDocuments(condition)
            let total_pages = Math.ceil(count_docs / limit)
            total_pages = total_pages === 0 ? 1 : total_pages

            return res.send({ status : true, code :200, message:null, current_page:page, total_pages,total_courses:count_docs, data:course_hole_list })
        }catch(e){
            next(e)
        }
    },
    getSingleCourseHole:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_data=await CourseHole.findOne({_id:course_id,user:req.user._id,is_deleted:false}).populate("user","email").select("-isDeleted")
            if(!course_data) return response.errorResponse(res,404,"course hole not found")

            response.successResponse(res,null,course_data)
        }catch(e){
            next(e)
        }
    },
    bulkUpdate:async(req,res,next)=>{
        try{
            const {course,holes}=req.body
            if(!course)return response.errorResponse(res,400,"course is required in request body")
            if(!holes || holes.length===0)return response.errorResponse(res,400,"holes array is required in request body")
        
            const course_data=await Course.findOne({_id:course,is_deleted:false,user:req.user._id})
            if(!course_data)return response.errorResponse(res,404,"course not found")

            let output=[]
            for(const hole of holes){
                try{
                    const hole_data=await CourseHole.findOne({number:hole.number,is_deleted:false,course:course})
                    if(hole_data){
                        const updates=Object.keys(hole)
                        updates.forEach((obj)=>{
                            hole_data[obj]=hole[obj]
                        })
                        await hole_data.save()
                        output.push(hole_data)
                    }else{
                        const new_course_hole=new CourseHole({ course:course,number:hole.number,par:hole.par,user:req.user._id})
                        await new_course_hole.save()
                        output.push(new_course_hole)
                    }
                }catch(e){}
            }

            response.successResponse(res,"cousre holelist updated",output)
        }catch(e){
            next(e)
        }
    },
    
    updateCourseHole:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_hole_data=await CourseHole.findOne({_id:course_id,is_deleted:false,user:req.user._id})
            if(!course_hole_data) return response.errorResponse(res,404,"course hole not found")

            const course_data=await Course.findOne({_id:req.body.course,is_deleted:false,user:req.user._id})
            if(!course_data)return response.errorResponse(res,404,"course not found")

            const updates=Object.keys(req.body)
            updates.forEach((obj)=>{
                course_hole_data[obj]=req.body[obj]
            })
            await course_hole_data.save()
            response.successResponse(res,"course hole updated",course_hole_data)
        }catch(e){
            next(e)
        }
    },
    deleteCourseHole:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_hole_data=await CourseHole.findOne({_id:course_id,is_deleted:false,user:req.user._id})
            if(!course_hole_data) return response.errorResponse(res,404,"course hole not found")


            course_hole_data.is_deleted=true
            await course_hole_data.save()


            response.successResponse(res,"course hole deleted",null)
         }catch(e){
            next(e)
        }
    },
}