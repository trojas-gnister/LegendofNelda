const express = require('express');
const exphbs = require('express-handlebars');
const apiRoutes = require('./controllers/routes/apiRoutes');
const htmlRoutes = require('./controllers/routes/htmlRoutes');
const session = require('express-session');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = process.env.PORT || 3001;

const app = express();


const hbs = exphbs.create();

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


app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

  

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
