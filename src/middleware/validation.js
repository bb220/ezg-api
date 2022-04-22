const response = require('../utils/response');

const validation = (schema) => {

    return (req, res, next) => {

        const { error } = schema.validate(req.body, { abortEarly: true });
        const valid = error == null;
      
        if (valid) {
            next();
      
        } else {
            const { details } = error;
            const message = details.map(e => e.message).join(',');
            response.errorResponse(res, 422, message)

        }
    }
}

module.exports = validation;