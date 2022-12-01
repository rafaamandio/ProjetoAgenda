require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.log(e));
const session = require('express-session'); // Sessões com cookies para identificar o usuário
const MongoStore = require('connect-mongo'); // Salvar a sessão no banco de dados
const flash = require('connect-flash'); // Messagem ao destrutiva
const routes = require('./routes'); // Rotas exemplo .../contatos .../home e etc...
const path = require('path'); // 
const helmet = require('helmet'); // 
const csrf = require('csurf'); // CSRF Tokens para segurança de formulários
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // São funções que são executadas no meio do caminho das rotas para funções diversas

app.use(helmet());

app.use(express.urlencoded({ extended: true })); //Aceita sal  
app.use(express.json()); // 
app.use(express.static(path.resolve(__dirname, 'public'))); // Arquivos estáticos que podem ser acessados diretamente 

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); // Arquivos renderizado na tela.
app.set('view engine', 'ejs'); // Qual a engine que está usando, nesse caso é o 'ejs'

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes); // Chamando as Rotas

app.on('pronto', () => { // Colocando a aplicação para escutar na porta 3000
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
