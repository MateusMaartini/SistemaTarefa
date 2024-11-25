import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./style.css"; // Caminho para o arquivo CSS

import {
  Button,
  Container,
  Typography,
  Box,
  CssBaseline,
  Switch,
  AppBar,
  Toolbar,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function App() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#ADD8E6" }, // Azul vibrante
      secondary: { main: "#90ee90" }, // Verde
      background: {
        default: darkMode ? "#121212" : "#f5f5f5", // Fundo neutro claro/escuro
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000", // Texto branco no escuro, preto no claro
      },
      action: {
        active: darkMode ? "#ff5722" : "#ff5722", //
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h4: {
        fontWeight: 600,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Navbar fixa no topo */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Lista de Tarefas
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Modo Escuro/Claro"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Espaço para evitar sobreposição */}
      <Toolbar />
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gerencie suas Tarefas
        </Typography>

        <Box textAlign="center" mb={3}>
          {!isFormVisible && (
            <Button
              variant="contained"
              color="secondary" // Cor verde para destaque
              onClick={() => setFormVisible(true)}
              sx={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: darkMode ? "#90ee90" : "#90ee90", // Toque de cor vibrante
                },
              }}
            >
              Adicionar Tarefa
            </Button>
          )}
        </Box>

        {isFormVisible && (
          <TaskForm
            onClose={({ tarefas, closeOnFinish = true }) => {
              if (tarefas) {
                setTasks(tarefas);
              }
              if (closeOnFinish) {
                setFormVisible(false);
              }
            }}
          />
        )}

        <TaskList tasks={tasks} setTasks={setTasks} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
