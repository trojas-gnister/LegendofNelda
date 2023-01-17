const router = require("express").Router();
const User = require("../../models/User");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// Route to handle user login
router.post("/login", async (req, res) => {
  // get the name and password from the request body
  const { name, password } = req.body;
  try {
    // Try to find a user with the provided name
    const dbUserData = await User.findOne({ where: { name: name } });
    if (!dbUserData) {
      // If no user is found, respond with an error message
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }
    // Check if the provided password matches the hashed password in the db
    const validPassword = dbUserData.checkPassword(password);
    if (!validPassword) {
      // If the password does not match, respond with an error message
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }
    // Save the session and set user_id and logged_in to true
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.logged_in = true;
      // Send a successful response
      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to handle user signup
router.post("/signup", async (req, res) => {
  // Destructure name and password from request body
  const { name, password } = req.body;
  try {
    // Check if a user already exists with the same name
    const dbUserData = await User.findOne({ where: { name: name } });
    if (dbUserData) {
      // If a user already exists, return an error message
      res.status(400).json({ message: "User already exists with that name!" });
      return;
    }
    // Create new user with the provided name and password
    const user = await User.create({ name, password });
    // Save the user's session
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      // Respond with the new user object and a message indicating successful signup and login
      res.json({ user, message: "You are now signed up and logged in!" });
    });
  } catch (err) {
    // If there is an error, return a server error status and the error message
    res.status(500).json(err);
  }
});

// Route to handle user logout
router.post("/logout", (req, res) => {
  // Check if user is logged in
  if (req.session.logged_in) {
    // Destroy the session
    req.session.destroy(() => {
      // Send a successful status code indicating logout was successful
      res.status(204).end();
    });
  } else {
    // Send a status code indicating that the user is not logged in
    res.status(404).end();
  }
});

router.post('/update-score', async (req, res) => {
    try {
      // Find the user in the database by their session ID
      console.log(req)
      const user = await User.findByPk(req.session.user_id);
      // Update the user's score in the database
      await user.update({ score: req.body.score });
      console.log(req.body.score)
      res.status(200).json({ message: 'Score updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating score' });
    }
});

router.put('/update-score', async (req, res) => {
    try {
        const { score, id } = req.body;
        const user = await User.findByPk(id);
        user.score = score;
        await user.save();
        res.json({ message: 'Score updated!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating score' });
    }
});

router.get('/user/:id/score', async (req, res) => {
    console.log(req)
    try {
      // Find the user in the database by their id
      const user = await User.findByPk(req.params.id);
      // Send the user's score back in the response
      res.json({ score: user.score });
    } catch (err) {
      // Handle any errors that occurred
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving the user\'s score' });
    }
  });

  router.get("/users/:id", (req, res) => {

    db.User.findOne({
        where: {
            id: req.params.id
        }
    }).then(user => {

        res.json(user);
    });
});

router.get("/users/current", (req, res) => {

    // Check if user is logged in
    if (req.session.logged_in) {
    // Send the user's data
        User.findOne({
            where: {
                id: req.session.user_id,
                score: req.session.score
            }
        }).then(data => {
            res.json(data);
        });
    } else {
    // Send an error message indicating that the user is not logged in
        res.status(404).json({
            message: "User not logged in"
        });
    }
});




// export the router
module.exports = router;

