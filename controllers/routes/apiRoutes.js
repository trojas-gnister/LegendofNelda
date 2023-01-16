const router = require('express').Router(); 
const User = require('../../models/User')
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try{
        const dbUserData = await User.findOne({ where: { name: name } });
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        const validPassword = dbUserData.checkPassword(password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        req.session.save(() => {
            console.log("this worked")
            console.log(req.session.logged_in)
            req.session.user_id = dbUserData.id;
            req.session.logged_in = true;
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    } catch (err) {              
        res.status(500).json(err);
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

module.exports = router;
