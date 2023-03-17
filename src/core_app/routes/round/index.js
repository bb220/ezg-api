const express = require('express')
const router = express.Router()
const round = require('../../controllers/round')
const validation=require("../../../middleware/validation")
const schemas=require("../../helpers/schemas")
const {verifyToken}=require("../../../middleware/auth")

router
    .post('/', validation(schemas.round_schema),verifyToken, round.createRound)
    .get('/', verifyToken, round.getRoundList)
    .get('/:round_id', verifyToken, round.getSingleRound)
    .put('/:round_id', validation(schemas.round_schema),verifyToken, round.updateRound)
    .delete("/:round_id",verifyToken,round.deleteRound)

module.exports = router

