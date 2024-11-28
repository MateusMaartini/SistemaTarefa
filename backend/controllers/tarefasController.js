const tarefasModel = require("../models/tarefasModel");

exports.getAllTarefas = (req, res) => {
  tarefasModel.getAllTarefas((err, results) => {
    if (err) return res.status(err.status).json({ error: err.message });
    res.status(200).json(results);
  });
};
exports.addTarefa = (req, res) => {
  const { nome, custo, data_limite, ordem } = req.body;

  // Verifica se os dados estão corretos
  if (!nome || !custo || !data_limite) {
    console.error("Dados incompletos:", { nome, custo, data_limite });
    return res
      .status(400)
      .json({ error: "Nome, custo e data_limite são obrigatórios" });
  }

  tarefasModel.addTarefa({ nome, custo, data_limite, ordem }, (err, result) => {
    if (err) {
      console.error(
        "Erro ao inserir tarefa no banco com ordem fornecida:",
        err
      );
      return res.status(err.status).json({ error: err.message });
    }
    res
      .status(201)
      .json({ id: result.insertId, nome, custo, data_limite, ordem });
  });
};

exports.updateTarefa = (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  tarefasModel.updateTarefa(id, { nome, custo, data_limite }, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao editar tarefa" });
    res.status(200).json({ message: "Tarefa atualizada com sucesso" });
  });
};

exports.deleteTarefa = (req, res) => {
  const { id } = req.params;

  tarefasModel.deleteTarefa(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir tarefa" });
    res.status(200).json({ message: "Tarefa excluída com sucesso" });
  });
};

exports.reorderTarefas = (req, res) => {
  const { ordens } = req.body;

  tarefasModel.reorderTarefas(ordens, (err) => {
    if (err)
      return res.status(500).json({ error: "Erro ao reordenar tarefas" });
    res.status(200).json({ message: "Tarefas reordenadas com sucesso" });
  });
};
