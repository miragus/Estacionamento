const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    user: 'postgres', // substitua com seu usuário do PostgreSQL
    host: 'localhost', // ou endereço do servidor PostgreSQL
    database: 'vehicle', // substitua pelo nome da sua base de dados
    password: 'BemVindo!', // substitua pela sua senha
    port: 5432, // porta padrão do PostgreSQL
});

// Middleware para parsear JSON
app.use(express.json());

// Rota para inserir veículos na tabela 'vehicle'
app.post('/api/vehicle', async (req, res) => {
    const { time, name, licence, year, type } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO vehicles (time, name, licence, year, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [time, name, licence, year, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao inserir veículo:', err);
        res.status(500).json({ error: 'Erro ao inserir veículo' });
    }
});



app.put('/api/vehicle', async (req, res) => {
    const { name, licence, year, time, type } = req.body;

    try {
        const result = await pool.query(
            'UPDATE vehicles SET name = $1, licence = $2, year = $3, time = $4, type = $5 WHERE licence = $6 RETURNING *',
            [name, licence, year, time, type, licence]  // Aqui o parâmetro 'licence' está sendo usado para identificar o veículo
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar veículo:', err);
        res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

