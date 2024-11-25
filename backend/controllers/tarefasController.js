const tarefasModel = require("../models/tarefasModel");

exports.getAllTarefas = (req, res) => {
  tarefasModel.getAllTarefas((err, results) => {
    if (err) {
      console.error("Erro ao obter tarefas:", err);
      return res.status(500).json({ error: "Erro ao obter tarefas" });
    }
    res.status(200).json(results);
  });
};

exports.addTarefa = (req, res) => {
  const { nome, custo, data_limite, ordem } = req.body;

  console.log("Dados recebidos no backend:", {
    nome,
    custo,
    data_limite,
    ordem,
  });

  if (!nome || !custo || !data_limite) {
    return res
      .status(400)
      .json({ error: "Nome, custo e data_limite são obrigatórios" });
  }

  if (ordem === undefined) {
    tarefasModel.getMaxOrdem((err, maxOrdem) => {
      if (err) {
        console.error("Erro ao obter a maior ordem:", err);
        return res
          .status(500)
          .json({ error: "Erro ao calcular ordem dinâmica" });
      }

      const novaOrdem = (maxOrdem?.ordem || 0) + 1;

      tarefasModel.addTarefa(
        { nome, custo, data_limite, ordem: novaOrdem },
        (err, result) => {
          if (err) {
            console.error("Erro ao adicionar tarefa:", err);
            return res.status(500).json({ error: "Erro ao adicionar tarefa" });
          }
          res.status(201).json({
            id: result.insertId,
            nome,
            custo,
            data_limite,
            ordem: novaOrdem,
          });
        }
      );
    });
  } else {
    tarefasModel.addTarefa(
      { nome, custo, data_limite, ordem },
      (err, result) => {
        if (err) {
          console.error("Erro ao adicionar tarefa com ordem:", err);
          return res.status(500).json({ error: "Erro ao adicionar tarefa" });
        }
        res.status(201).json({
          id: result.insertId,
          nome,
          custo,
          data_limite,
          ordem,
        });
      }
    );
  }
};

exports.updateTarefa = (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  tarefasModel.updateTarefa(id, { nome, custo, data_limite }, (err) => {
    if (err) {
      console.error("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
    res.status(200).json({ message: "Tarefa atualizada com sucesso" });
  });
};

exports.deleteTarefa = (req, res) => {
  const { id } = req.params;

  tarefasModel.deleteTarefa(id, (err) => {
    if (err) {
      console.error("Erro ao excluir tarefa:", err);
      return res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
    res.status(200).json({ message: "Tarefa excluída com sucesso" });
  });
};

exports.reorderTarefas = (req, res) => {
  const { ordens } = req.body;

  tarefasModel.reorderTarefas(ordens, (err) => {
    if (err) {
      console.error("Erro ao reordenar tarefas:", err);
      return res.status(500).json({ error: "Erro ao reordenar tarefas" });
    }
    res.status(200).json({ message: "Tarefas reordenadas com sucesso" });
  });
};
