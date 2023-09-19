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

// Rota para exibir a página de login
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza a página de login
});

// Rota para processar o formulário de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
      if (rows.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/layout'); // Redireciona para a página após o login
      } else {
        res.render('login', { error: 'Credenciais inválidas!' }); // Renderiza a página de login com a mensagem de erro
      }
    } catch (error) {
      console.error(error);
    } finally {
      connection.release();
    }
  });

// Rota para realizar o logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
