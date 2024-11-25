import React, { useState } from "react";
import axios from "axios";
import {
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  CheckCircle,
  Pending,
  Alarm,
} from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  useTheme,
  Chip,
  Badge,
  Slide,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

const TaskItem = ({ task, onTaskUpdate, onMove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme(); // Detecta o tema atual
  const isHighCost = task.custo >= 1000; // Verifica se o custo é maior ou igual a 1000
  const isUrgent = new Date(task.data_limite) < new Date(); // Verifica se a tarefa está vencida

  // Função para salvar a edição
  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5000/tarefas/${task.id}`, editedTask);
      setSnackbarMessage("Tarefa atualizada com sucesso!");
      setOpenSnackbar(true);
      onTaskUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  // Função para excluir a tarefa
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tarefas/${task.id}`);
      setSnackbarMessage("Tarefa excluída com sucesso!");
      setOpenSnackbar(true);
      onTaskUpdate();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir a tarefa:", error);
    }
  };

  // Verifica se task.custo é um número válido antes de chamar toFixed
  const custo = Number(task.custo);
  const formattedCusto = !isNaN(custo) ? custo.toFixed(2) : "N/A"; // Se não for um número válido, mostra 'N/A'

  return (
    <>
      <Slide in={true} direction="up" timeout={500}>
        <Badge
          badgeContent={
            task.completed ? (
              <CheckCircle color="success" />
            ) : (
              <Pending color="warning" />
            )
          }
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Card
            sx={{
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(0, 0, 0, 0.6)"
                  : "0 4px 12px rgba(0, 0, 0, 0.1)", // Sombra mais forte no modo escuro
              width: "100%",
              borderRadius: "16px", // Bordas mais arredondadas
              overflow: "hidden",
              backgroundColor: isHighCost
                ? theme.palette.mode === "dark"
                  ? "#FF7043" // Vermelho mais suave no modo dark
                  : "#FFEBEE" // Rosa claro no modo claro
                : theme.palette.mode === "dark"
                  ? "#424242"
                  : "#E3F2FD", // Azul suave para tarefas normais
              color: isHighCost
                ? theme.palette.mode === "dark"
                  ? "#FFF"
                  : "#D32F2F"
                : theme.palette.mode === "dark"
                  ? "#FFF"
                  : "#1976D2", // Azul suave ou vermelho dependendo do custo
              marginBottom: "20px",
              border: isHighCost && "2px solid #FF7043", // Borda fina para tarefas de alto custo
              transition: "all 0.3s ease", // Transição suave
              "&:hover": {
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Efeito hover suave
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: task.completed
                    ? "#BDBDBD"
                    : theme.palette.mode === "dark"
                      ? "#90CAF9"
                      : "#1976D2", // Azul suave ou mais neutro para concluídas
                  mb: 1,
                  textDecoration: task.completed ? "line-through" : "none", // Risco nas concluídas
                }}
              >
                {task.nome}
              </Typography>

              {/* Tarefa Urgente */}
              {isUrgent && (
                <Chip
                  label="Vencida"
                  color="error"
                  icon={<Alarm />}
                  sx={{ mb: 2 }}
                />
              )}

              <Chip
                label={isHighCost ? "Alto Custo" : "Normal"}
                color={isHighCost ? "error" : "success"}
                sx={{ mb: 2 }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: isHighCost
                    ? theme.palette.mode === "dark"
                      ? "#FFEBEE"
                      : "#FF7043"
                    : theme.palette.mode === "dark"
                      ? "#90CAF9"
                      : "green", // Diferencia o custo alto
                  fontWeight: "medium",
                }}
              >
                Custo: R${formattedCusto}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isHighCost
                    ? theme.palette.mode === "dark"
                      ? "#FFEBEE"
                      : "#D32F2F"
                    : theme.palette.mode === "dark"
                      ? "#BDBDBD"
                      : "#555",
                  fontStyle: "italic",
                  mb: 1,
                }}
              >
                Data Limite: {new Date(task.data_limite).toLocaleDateString()}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between" }}>
              <div>
                <Tooltip title="Editar Tarefa" arrow>
                  <IconButton onClick={() => setIsEditing(true)}>
                    <Edit
                      color={
                        theme.palette.mode === "dark" ? "primary" : "inherit"
                      }
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Excluir Tarefa" arrow>
                  <IconButton onClick={() => setDeleteModalOpen(true)}>
                    <Delete
                      color={
                        theme.palette.mode === "dark" ? "error" : "inherit"
                      }
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div>
                <Tooltip title="Mover para Cima" arrow>
                  <IconButton
                    onClick={() => onMove(task.id, "up")}
                    disabled={task.ordem === 1}
                  >
                    <ArrowUpward
                      color={
                        theme.palette.mode === "dark" ? "inherit" : "action"
                      }
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Mover para Baixo" arrow>
                  <IconButton onClick={() => onMove(task.id, "down")}>
                    <ArrowDownward
                      color={
                        theme.palette.mode === "dark" ? "inherit" : "action"
                      }
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </CardActions>

            {/* Modal para Edição */}
            <Dialog
              open={isEditing}
              onClose={() => setIsEditing(false)}
              sx={{ padding: 2 }}
            >
              <DialogTitle
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Editar Tarefa
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nome da Tarefa"
                  value={editedTask.nome}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, nome: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="Custo"
                  value={editedTask.custo}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, custo: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="date"
                  label="Data Limite"
                  value={editedTask.data_limite}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      data_limite: e.target.value,
                    })
                  }
                  sx={{ mb: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleEditSave}
                  variant="contained"
                  color="primary"
                >
                  Salvar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outlined"
                  color="primary"
                >
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>

            {/* Modal de Exclusão */}
            <Dialog
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              sx={{ padding: 2 }}
            >
              <DialogTitle
                sx={{ fontWeight: "bold", color: theme.palette.error.main }}
              >
                Confirmar Exclusão
              </DialogTitle>
              <DialogContent>
                <Typography>
                  Você tem certeza que deseja excluir esta tarefa?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                >
                  Excluir
                </Button>
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  variant="outlined"
                  color="primary"
                >
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Badge>
      </Slide>

      {/* Snackbar para feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskItem;
