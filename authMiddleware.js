// authMiddleware.js

function authenticate(req, res, next) {
    if (req.session.loggedin) {
      next(); // Continua para a próxima rota se autenticado
    } else {
      res.redirect('/login'); // Redireciona para a página de login se não autenticado
    }
  }
  
  module.exports = authenticate;
  