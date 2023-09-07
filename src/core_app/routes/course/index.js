const express = require('express')
const router = express.Router()
const course = require('../../controllers/course')
const validation=require("../../../middleware/validation")
const schemas=require("../../helpers/schemas")
const {verifyToken}=require("../../../middleware/auth")

router
    .post('/', validation(schemas.course_schema_create),verifyToken, course.createCourse)
    .get('/', verifyToken, course.getCourseList)
    .get('/:course_id', verifyToken, course.getSingleCourse)
    .put('/:course_id', validation(schemas.course_schema),verifyToken, course.updateCourse)
    .delete("/:course_id",verifyToken,course.deleteCourse)

module.exports = router

