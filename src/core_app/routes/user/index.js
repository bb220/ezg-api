const express = require('express')
const router = express.Router()
const user = require('../../controllers/user')
const validation = require("../../../middleware/validation")
const schemas = require("../../helpers/schemas")
const {verifyToken}=require("../../../middleware/auth")


router
    .post('/reg', validation(schemas.user_account), user.createAccount)
    .post('/login', validation(schemas.user_account), user.loginWithEmail)
    .get('/', verifyToken, user.getUserList)
    .delete("/:user_id",verifyToken,user.deleteUser)
    .put('/:user_id', validation(schemas.user_account), user.updateAccount)


module.exports = router