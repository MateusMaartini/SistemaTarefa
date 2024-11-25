import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ taskId, onClose }) => {
  const [task, setTask] = useState({
    nome: "",
    custo: "",
    data_limite: "",
  });

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/tarefas/${taskId}`
          );
          setTask(response.data);
        } catch (error) {
          console.error("Erro ao buscar a tarefa:", error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskId) {
        // Atualizar tarefa existente
        await axios.put(`http://localhost:5000/tarefas/${taskId}`, task);
        alert("Tarefa atualizada com sucesso!");
      } else {
        // Criar nova tarefa
        await axios.post("http://localhost:5000/tarefas", task);
        alert("Tarefa criada com sucesso!");
        onClose({ closeOnFinish: true });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Erro ao salvar tarefa.";
      alert(errorMsg);
      console.error(errorMsg, error);
    } finally {
      const response = await axios.get("http://localhost:5000/tarefas");
      onClose({ tarefas: response.data, closeOnFinish: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da Tarefa"
        value={task.nome}
        onChange={(e) => setTask({ ...task, nome: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Custo"
        value={task.custo}
        onChange={(e) => setTask({ ...task, custo: e.target.value })}
        required
      />
      <input
        type="date"
        value={task.data_limite}
        onChange={(e) => setTask({ ...task, data_limite: e.target.value })}
        required
      />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onClose}>
        Cancelar
      </button>
    </form>
  );
};

export default TaskForm;
