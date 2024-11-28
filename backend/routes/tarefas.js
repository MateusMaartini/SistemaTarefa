const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');
const { validateSchema } = require('../middleware/validateSchema');
const { taskSchema, taskSchemaUpdate } = require('../schemas/tarefa.schema');

router.get('/', tarefasController.getAllTarefas);
router.post('/', validateSchema(taskSchema), tarefasController.addTarefa);
router.put(
  '/:id',
  validateSchema(taskSchemaUpdate),
  tarefasController.updateTarefa
);
router.delete('/:id', tarefasController.deleteTarefa);
router.patch('/reordenar', tarefasController.reorderTarefas);

module.exports = router;
