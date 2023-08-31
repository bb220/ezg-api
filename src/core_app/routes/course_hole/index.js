const express = require('express')
const router = express.Router()
const course_hole = require('../../controllers/course_hole')
const validation=require("../../../middleware/validation")
const schemas=require("../../helpers/schemas")
const {verifyToken}=require("../../../middleware/auth")

router
    .post('/', validation(schemas.course_hole_schema),verifyToken, course_hole.createCourseHole)
    .get('/', verifyToken, course_hole.getCourseHoleList)
    .get('/:course_id', verifyToken, course_hole.getSingleCourseHole)
    .put('/bulk',verifyToken,course_hole.bulkUpdate)
    .put('/:course_id', validation(schemas.course_hole_schema),verifyToken, course_hole.updateCourseHole)
    .delete("/:course_id",verifyToken,course_hole.deleteCourseHole)

module.exports = router

