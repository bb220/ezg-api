const {Course, CourseHole}=require("../../../database/models")
const response = require("../../../utils/response")

module.exports={
    createCourse:async(req,res,next)=>{
        try{
            const {holes}=req.body
            let holes_data=[]
            const new_course=new Course({...req.body,user:req.user._id})
            await new_course.save()
            let course_data = {
                _id: new_course._id,
                name: new_course.name
            }

            if(holes?.length>0){
                let hole_list=holes.map((hole)=>{
                    return {
                        ...hole,
                        "course":new_course._id,
                        user:req.user._id
                    }
                })
                holes_data=await CourseHole.create(hole_list)
            }

            response.successResponse(res,"course created",{...course_data,holes_data})
        }catch(e){
            next(e)
        }
    },
    getCourseList:async(req,res,next)=>{
        try{
            let { page = 1, limit = 10 ,search} = req.query
            limit = Number(limit)
            page = Number(page)
            const offset = (page - 1) * limit;            
            let condition = {user:req.user._id, is_deleted:false}

            if(search){
                condition = {...condition,$or:[ {name:{ $regex: search, $options: 'si' }}] } 
            }

            const course_list = await Course.find(condition).sort({ createdAt: -1 }).populate("user","email").limit(limit).skip(offset).select("name createdAt updatedAt")

            const count_docs = await Course.countDocuments(condition)
            let total_pages = Math.ceil(count_docs / limit)
            total_pages = total_pages === 0 ? 1 : total_pages

            return res.send({ status : true, code :200, message:null, current_page:page, total_pages,total_courses:count_docs, data:course_list })
        }catch(e){
            next(e)
        }
    },
    getSingleCourse:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_data=await Course.findOne({_id:course_id,user:req.user._id,is_deleted:false}).populate("user","email").select("name createdAt updatedAt")
            if(!course_data) return response.errorResponse(res,404,"course not found")

            response.successResponse(res,null,course_data)
        }catch(e){
            next(e)
        }
    },

    updateCourse:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_data=await Course.findOne({_id:course_id,is_deleted:false,user:req.user._id})
            if(!course_data) return response.errorResponse(res,404,"course not found")

            const updates=Object.keys(req.body)
            updates.forEach((obj)=>{
                course_data[obj]=req.body[obj]
            })
            await course_data.save()
            response.successResponse(res,"course updated",course_data)
        }catch(e){
            next(e)
        }
    },
    deleteCourse:async(req,res,next)=>{
        try{
            const {course_id}=req.params
            const course_data=await Course.findOne({_id:course_id,is_deleted:false,user:req.user._id})
            if(!course_data) return response.errorResponse(res,404,"course not found")

            course_data.is_deleted=true
            await course_data.save()

            await CourseHole.updateMany({course:course_id},{is_deleted:true})

            response.successResponse(res,"course deleted",null)
         }catch(e){
            next(e)
        }
    },
}