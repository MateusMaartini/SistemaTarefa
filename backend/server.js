const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv/config');

// Importando as rotas de tarefas
const tarefasRoutes = require('./routes/tarefas');

// Configuração do CORS para permitir requisições do frontend (localhost:3000)
app.use(cors());

// Middleware para aceitar JSON no corpo das requisições
app.use(express.json());

// Usando as rotas de tarefas
app.use('/tarefas', tarefasRoutes);

// Rota inicial para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor Express está funcionando');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
