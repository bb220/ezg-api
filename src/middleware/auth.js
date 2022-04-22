const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const response = require("../utils/response")

module.exports = {

    generateNewToken: (user) => {
        const auth_token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "10d" });
        return auth_token
    },

    verifyToken: async (req, res, next) => {

        try {

            if (!req.headers['authorization']) return response.errorResponse(res, 401, "please send token in header")

            const token = req.headers['authorization'].split(' ')[1]

            if (!token) return response.errorResponse(res, 401, "Not Authorized")

            const decode = await jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findOne({ _id: decode._id, is_deleted: false })

            if (!user) return response.errorResponse(res, 401,"User not found")

            if (user.status === "deactivated") return response.errorResponse(res, 400, "account deactivated")

            if (user.is_deleted == true) return response.errorResponse(res, 400, "account deleted")

            req.user = user
            req.role = user.role

            next()
        } catch (error) {
            console.log(error)
            return response.errorResponse(res, 401, "Invalid Token")
        }
    }
}
