const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongooseError);

const Contact = model('contact', contactSchema);

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is a required field',
  }),
  email: Joi.string().required().messages({
    'any.required': 'Email is a required field',
    'string.email': 'Email must be a valid email',
  }),
  phone: Joi.string()
    .required()
    .length(11)
    .pattern(/^[0-9]+$/)
    .messages({
      'any.required': `Phone is a required field`,
      'string.pattern.base': 'Phone should include only digits',
      'string.length': 'Phone length must be 11 characters long',
    }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'missing field favorite',
  }),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

module.exports = {
  Contact,
  schemas,
};
