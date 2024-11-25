const db = require("./db");
const Joi = require("joi");

exports.getAllTarefas = (callback) => {
  const query = "SELECT * FROM tarefas ORDER BY ordem ASC";
  db.query(query, callback);
};

exports.getMaxOrdem = (callback) => {
  const query = "SELECT MAX(ordem) AS ordem FROM tarefas";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]); // Retorna { ordem: X }
  });
};

exports.addTarefa = (tarefa, callback) => {
  const query = "INSERT INTO tarefas SET ?";
  db.query(query, tarefa, callback);
};

exports.updateTarefa = (id, tarefa, callback) => {
  const query = "UPDATE tarefas SET ? WHERE id = ?";
  db.query(query, [tarefa, id], callback);
};

exports.deleteTarefa = (id, callback) => {
  const query = "DELETE FROM tarefas WHERE id = ?";
  db.query(query, id, callback);
};

exports.reorderTarefas = (ordens, callback) => {
  const queries = ordens
    .map(
      ({ id, ordem }) => `UPDATE tarefas SET ordem = ${ordem} WHERE id = ${id};`
    )
    .join(" ");
  db.query(queries, callback);
};
