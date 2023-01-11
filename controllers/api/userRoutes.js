const router = require('express').Router();
const { User } = require('../../models');
const db = require("../../models");

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { name: req.body.name } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.post("/signup", async function (req, res) {
  console.log(req.body)
  try {
    const user = await db.User.create(req.body, {
      name: req.body.name,
      password: req.body.password,
    })
    console.log(req.session)
    req.session.isLoggedIn = true;
    req.session.userId = user.id;
    req.session.save(() => res.json({ id: user.id }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }

});

router.post("/game", function (req, res) {
  if (!req.user) {
      res.redirect("/login");
  } else {
      db.Game.create(req.body).then(function (game) {
          res.json(game);
      }).catch(function (err) {
          res.status(401).json(err);
      });
  }
});

module.exports = router;
