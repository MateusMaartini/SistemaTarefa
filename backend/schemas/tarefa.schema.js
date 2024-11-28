const Joi = require('joi');

exports.taskSchema = Joi.object({
  nome: Joi.string().required().label('Nome da tarefa'),
  custo: Joi.number().required().label('Custo total'),
  data_limite: Joi.string().required().label('Data Limite'),
  ordem: Joi.number().integer().optional().label('Ordem da tarefa'),
}).messages({
  'any.required': '{#label} é obrigatório.',
  'string.base': '{#label} deve ser um texto.',
  'number.base': '{#label} deve ser um número.',
});

exports.taskSchemaUpdate = Joi.object({
  nome: Joi.string().optional().label('Nome da tarefa'),
  custo: Joi.number().optional().label('Custo total'),
  data_limite: Joi.string().optional().label('Data Limite'),
  ordem: Joi.number().integer().optional().label('Ordem da tarefa'),
}).messages({
  'string.base': '{#label} deve ser um texto.',
  'number.base': '{#label} deve ser um número.',
});
