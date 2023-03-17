const express = require('express')
const router = express.Router()
const hole = require('../../controllers/hole')
const validation=require("../../../middleware/validation")
const schemas=require("../../helpers/schemas")
const {verifyToken}=require("../../../middleware/auth")

router
    .post('/', validation(schemas.hole_schema),verifyToken, hole.createHole)
    .get('/', verifyToken, hole.getHoleList)
    .get('/:hole_id', verifyToken, hole.getSingleHole)
    .put('/:hole_id', validation(schemas.hole_schema),verifyToken, hole.updateHole)
    .delete("/:hole_id",verifyToken,hole.deleteHole)

module.exports = router

