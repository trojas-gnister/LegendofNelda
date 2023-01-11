const path = require('path');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const express = require('express');
const sequelize = require('./config/connection');
const sessionMiddleware = require("./config/session");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(sessionMiddleware);
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

  
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

  