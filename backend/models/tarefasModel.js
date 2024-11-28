const { database } = require("./db");
const Joi = require("joi");

const collection = database.collection("tarefas");

// Obter todas as tarefas ordenadas
// Obter todas as tarefas ordenadas
exports.getAllTarefas = async (callback) => {
  try {
    // Busca as tarefas ordenadas pelo campo "ordem"
    const tarefas = await collection.find().sort({ ordem: 1 }).toArray();

    // Verifica se não há tarefas e retorna uma lista vazia
    if (tarefas.length === 0) {
      return callback(null, []); // Retorna lista vazia sem erro
    }

    // Retorna as tarefas
    callback(null, tarefas);
  } catch (error) {
    console.error("Erro ao obter as tarefas:", error);
    callback(
      { status: 500, message: "Erro interno ao buscar as tarefas." },
      null
    );
  }
};

// Cria uma nova tarefa
exports.addTarefa = async (tarefa, callback) => {
  try {
    // Verificar se já existe uma tarefa com o mesmo nome

    const { nome, ordem, custo, data_limite } = tarefa;

    const taskWithSameName = await collection.find({ name: nome }).toArray();

    if (taskWithSameName.length > 0) {
      return callback(
        { status: 400, message: "Já existe uma tarefa com este nome." },
        null
      );
    }

    // Obter a maior ordem se nenhuma for fornecida
    let ordemFinal = ordem;
    if (!ordem) {
      const [taskWithGreaterOrder] = await collection
        .find()
        .sort({ ordem: -1 })
        .toArray();

      ordemFinal = taskWithGreaterOrder.ordem
        ? taskWithGreaterOrder.ordem + 1
        : 1;
    }

    // Verificar se a ordem fornecida já está em uso
    const taskWithSameOrder = await collection
      .find({ ordem: +ordem })
      .toArray();

    if (taskWithSameOrder.length > 0) {
      return callback(
        { status: 400, message: "A ordem fornecida já está em uso." },
        null
      );
    }
    // Inserir a nova tarefa
    const inserted = await collection.insertOne({
      name: nome,
      custo,
      data_limite,
      ordem: ordemFinal,
    });

    callback(null, {
      message: "Tarefa criada com sucesso.",
      insertId: inserted.insertedId,
    });
  } catch (error) {
    console.error("Erro ao criar a tarefa:", error);
    callback({ status: 500, message: "Erro interno no servidor." }, null);
  }
};

// Edita uma tarefa
// Edita uma tarefa
exports.updateTarefa = async (id, tarefa, callback) => {
  try {
    const { nome, custo, data_limite } = await taskSchema.validateAsync(tarefa);

    // Verificar se já existe uma tarefa com o mesmo nome e ID diferente
    const taskWithSameName = await collection.findOne({
      nome,
      _id: { $ne: new ObjectId(id) },
    });
    if (taskWithSameName) {
      return callback(
        { status: 400, message: "Já existe uma tarefa com este nome." },
        null
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome, custo, data_limite } }
    );
    if (result.matchedCount === 0) {
      return callback({ status: 404, message: "Tarefa não encontrada." }, null);
    }

    callback(null, { message: "Tarefa atualizada com sucesso." });
  } catch (error) {
    if (error.isJoi) {
      callback(
        {
          status: 400,
          message: "Erro de validação: " + error.details[0].message,
        },
        null
      );
    } else {
      console.error("Erro ao atualizar a tarefa:", error);
      callback({ status: 500, message: "Erro interno no servidor." }, null);
    }
  }
};

// Exclui uma tarefa
// Exclui uma tarefa
exports.deleteTarefa = async (id, callback) => {
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return callback({ status: 404, message: "Tarefa não encontrada." }, null);
    }

    callback(null, { message: "Tarefa excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir a tarefa:", error);
    callback({ status: 500, message: "Erro interno no servidor." }, null);
  }
};

// Atualiza a ordem das tarefas
exports.reorderTarefas = async (ordens, callback) => {
  try {
    const updates = ordens.map(({ id, ordem }) =>
      collection.updateOne({ _id: new ObjectId(id) }, { $set: { ordem } })
    );
    await Promise.all(updates);
    callback(null, { message: "Ordem das tarefas atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao reordenar as tarefas:", error);
    callback({ status: 500, message: "Erro interno no servidor." }, null);
  }
};
