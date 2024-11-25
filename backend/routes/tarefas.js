const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefasController");

router.get("/", tarefasController.getAllTarefas);
router.post("/", tarefasController.addTarefa);
router.put("/:id", tarefasController.updateTarefa);
router.delete("/:id", tarefasController.deleteTarefa);

router.patch("/reordenar", tarefasController.reorderTarefas);

module.exports = router;
