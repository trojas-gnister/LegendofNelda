const express = require("express");
const exphbs = require("express-handlebars");
const apiRoutes = require("./controllers/routes/apiroutes1");
const htmlRoutes = require("./controllers/routes/htmlroutes1");
const session = require("express-session");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const PORT = process.env.PORT || 3001;

const app = express();

// create a new instance of express-handlebars
const hbs = exphbs.create();

// configuration for express-session and connect-session-sequelize
const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// middleware to use express-session
app.use(session(sess));

// middleware to use public directory for static files
app.use(express.static("public"));

// middleware for api routes
app.use("/api", apiRoutes);

// middleware for html routes
app.use("/", htmlRoutes);

// set view engine to handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// sync sequelize models and start server
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
