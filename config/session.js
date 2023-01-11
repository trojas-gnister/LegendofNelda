const session = require("express-session");
const sequelize = require("./connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);


const sess = {
    secret: 'Super secret secret',
    cookie: {
      maxAge: 8
    },
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  };

  module.exports = session(sess);
