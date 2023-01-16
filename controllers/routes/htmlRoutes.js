// importing the express router, which allows for the creation of modular, mountable route handlers
const router = require("express").Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// create a GET endpoint for the root route ('/signup')
router.get("/signup", (req, res) => {
  res.render("signup", { req });
});

// create a GET endpoint for the root route ('/login')
router.get("/login", (req, res) => {
  res.render("login", { req });
});

// create a GET endpoint for the root route ('/game')
router.get("/game", (req, res) => {
  console.log(req.session.logged_in);
  console.log(req.session);

  res.render("game", { req });
});

// create a GET endpoint for the root route ('/')
router.get("/", (req, res) => {
  res.render("homepage", { req });
});

// create a catch-all GET endpoint for any other route
router.get("*", (req, res) => {
  res.render("homepage", { req });
});

// export the router
module.exports = router;
