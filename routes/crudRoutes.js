const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'insira seu host',
  user: 'seu usuario',
  password: 'sua senha',
  database: 'seu banco',
  port: 3306 //porta do banco
});

// Rota para renderizar a view CRUD
router.get('/crud', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT * FROM users');
      res.render('crud', { users });
    } catch (error) {
      console.error(error);
    } finally {
      connection.release();
    }
  });
  
// Rota para listar todos os usuários
router.get('/users', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
});

// Rota para criar um novo usuário
router.post('/users', async (req, res) => {
  const { username, password } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);    
    res.redirect('/crud');
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
});

// Rota para atualizar um usuário
router.post('/users/:id', async (req, res) => {    
    const { username, password } = req.body;
    const userId = req.params.id;
    console.log('Dados recebidos:', username, password); // Adicione esta linha

    const connection = await pool.getConnection();
    try {
      await connection.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, userId]);
      res.send('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao atualizar usuário');
    } finally {
      connection.release();
    }
  });
  

// Rota para deletar um usuário
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    res.send('Usuário deletado com sucesso!');
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
});


// Rota para buscar a contagem de usuários
router.get('/api/userCount', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) AS user_count FROM users');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
  } finally {
    connection.release();
  }
});




module.exports = router;
