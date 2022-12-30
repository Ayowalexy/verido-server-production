const Joi = require('joi');


const assetItemsSchema = Joi.object({
    title: Joi
        .string()
        .required(),
    price: Joi
        .string()
        .required(),
    lifeCount: Joi
        .string()
        .required(),
    lifePeriod: Joi
        .string()
        .required(),
    description: Joi
        .string()
        .required(),
    safeDelete: Joi
        .string()
        .required()

})

const videoSchema = Joi.object({
    category: Joi
        .string()
        .required(),
    vidoeID: Joi
        .string()
        .required(),
    title: Joi
        .string()
        .required()
})

module.exports = {
    assetItemsSchema,
    videoSchema
}