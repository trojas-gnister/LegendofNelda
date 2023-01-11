const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const express = require('express');



const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const hbs = exphbs.create();

const PORT = process.env.PORT || 8080;

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
process.env.PWD = process.cwd();
app.use(express.static(path.join(process.env.PWD, 'public')));


app.use(routes);


// connect db and listen
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.error(err);
        return process.exit(1);
      }
      console.log(`App listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

  