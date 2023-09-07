const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const schemas = {

    user_account: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        device_name: Joi.string().optional().allow("")
    }),
    access_token: Joi.object().keys({
        refresh_token: Joi.string().required()
    }),
    round_schema: Joi.object().keys({
        name: Joi.string().optional(),
        course:Joi.objectId().optional().allow(""),
        played_date: Joi.string().optional()
    }),

    hole_schema: Joi.object().keys({
        round: Joi.objectId().required(),
        number: Joi.number().required(),
        par: Joi.number().optional(),
        score: Joi.number().required(),
        putts: Joi.number().optional()
    }),
    course_schema: Joi.object().keys({
        name: Joi.string().optional()
    }),
    course_schema_create: Joi.object().keys({
        name: Joi.string().optional(),
        holes:Joi.array().items({
            number: Joi.number().required(),
            par: Joi.number().empty()
        }).optional()
    }),
    course_hole_schema: Joi.object().keys({
        course: Joi.objectId().required(),
        number: Joi.number().required(),
        par: Joi.number().optional()
    }),

};
module.exports = schemas;
