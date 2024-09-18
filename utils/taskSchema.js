import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': `Title must contain value`,
  }),
  description: Joi.string().required().messages({
    'string.empty': `Description must contain value`,
  }),
  status: Joi.string().required().messages({
    'any.required': 'Status is required',
  }),
});

export { taskSchema };
