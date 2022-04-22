const response = require('../utils/response')

module.exports = {

    routesNotFound: (req, res, next) => {

        const error = new Error(`Url Not found -${req.originalUrl}`)
        res.statusCode = 404
        next(error)
    },

    globalErrorHandler: (error, req, res, next) => {

        console.log(error.message)
        return response.errorResponse(res, res.statusCode == 404 ? 404 : 500, error.message)
    }
}