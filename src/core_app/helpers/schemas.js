const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const schemas = {

    user_account: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
    round_schema: Joi.object().keys({
        name: Joi.string().optional(),
        played_date: Joi.string().optional()
    }),

    hole_schema: Joi.object().keys({
        round: Joi.objectId().required(),
        number: Joi.number().required(),
        par: Joi.number().optional(),
        score: Joi.number().required(),
        putts: Joi.number().optional()
    }),



};
module.exports = schemas;
