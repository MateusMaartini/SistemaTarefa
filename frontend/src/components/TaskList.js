import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import {
  List,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const TaskList = ({ tasks, setTasks }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/tarefas");

      // Verifica se os dados são uma lista antes de definir as tarefas
      if (Array.isArray(response.data)) {
        setTasks(response.data); // O backend já envia ordenado
      } else {
        console.error("Resposta inválida do backend:", response.data);
        setTasks([]); // Garante que o estado de tarefas não fique indefinido
      }
    } catch (error) {
      console.error("Erro ao carregar as tarefas:", error);
      setTasks([]); // Define uma lista vazia em caso de erro
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  const handleMove = async (id, direction) => {
    const currentIndex = tasks.findIndex((task) => task.id === id);
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const updatedTasks = [...tasks];
    [updatedTasks[currentIndex], updatedTasks[targetIndex]] = [
      updatedTasks[targetIndex],
      updatedTasks[currentIndex],
    ];

    setTasks(
      updatedTasks.map((task, index) => ({ ...task, ordem: index + 1 }))
    );

    // Sincronização com o back-end
    try {
      await axios.put("http://localhost:5000/tarefas/reorder", {
        tasks: updatedTasks.map((task) => ({
          id: task.id,
          ordem: task.ordem,
        })),
      });
    } catch (error) {
      console.error("Erro ao atualizar a ordem no servidor:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filtra as tarefas com base no termo de busca
  const filteredTasks = tasks.filter((task) =>
    task.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.concluida).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <Container>
      {/* Resumo das Tarefas */}
      <Box display="flex" justifyContent="space-between" my={2}>
        <Typography variant="subtitle1">
          Pendentes: <strong>{pendingTasks}</strong>
        </Typography>
        <Typography variant="subtitle1">
          Concluídas: <strong>{completedTasks}</strong>
        </Typography>
        <Typography variant="subtitle1">
          Total: <strong>{totalTasks}</strong>
        </Typography>
      </Box>

      {/* Campo de busca */}
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Buscar Tarefas"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <CircularProgress style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdate={fetchTasks}
              onMove={handleMove}
            />
          ))}
        </List>
      )}
    </Container>
  );
};

export default TaskList;
