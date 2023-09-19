const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const loginRoutes = require('./routes/loginRoutes');
const crudRoutes = require('./routes/crudRoutes');
const authMiddleware = require('./authMiddleware'); // Importa o middleware de autenticação
const methodOverride = require("method-override");
const path = require('path');



const app = express();


app.use(methodOverride("_method"));

app.set('view engine', 'ejs'); // Configura o Express para usar o EJS
app.set('views', __dirname + '/views'); // Especifica onde estão os arquivos de visualização


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

const pool = mysql.createPool({
  host: 'insira seu host',
  user: 'seu usuario',
  password: 'sua senha',
  database: 'seu banco',
  port: 3306 //porta do banco
});


app.use(express.static('public'));// habilita pasta public com css e js

// Adiciona o pool de conexões na requisição(pagina inicial login)
app.get('/', (req, res) => {
  res.redirect('/login');
});

//para acessar essas rotas é necessario estar logado
app.use(['/crud','/home', '/layout'], authMiddleware);

//rotas do login e crud
app.use(loginRoutes);
app.use(crudRoutes);

//rota da pagina layout após login
app.get('/layout', (req, res) => {
    res.render('layout', { username: req.session.username });
  });

  //rota da pagina home
app.get('/home', (req, res) => {
    res.render('home', { username: req.session.username });
  });

//rota para o crud
app.get('/crud', (req, res) => {
    res.render('crud', { username: req.session.username });
  });

//conexão com o banco na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
