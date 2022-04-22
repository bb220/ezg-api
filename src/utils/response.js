module.exports = {

    successResponse: (res, message = null, data = null, current_page, total_pages) => {

        return res.send({ status : true, code :200, message, current_page, total_pages, data })

    },
    errorResponse: (res, code = 400, message) => {

        return res.status(code).send({ status :false, code, message, data :null })
    },

}