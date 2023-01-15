// importing the express router, which allows for the creation of modular, mountable route handlers
const router = require('express').Router(); 


// create a GET endpoint for the root route ('/signup')
router.get('/signup', (req, res) => {  
    res.render('signup');
});

// create a GET endpoint for the root route ('/login')
router.get('/login', (req, res) => {  
    res.render('login');
});

// create a GET endpoint for the root route ('/game')
router.get('/game', (req, res) => { 
    res.render('game');
});

// create a GET endpoint for the root route ('/')
router.get('/', (req, res) => { 
    res.render('homepage');
});

// create a catch-all GET endpoint for any other route
router.get('*', (req, res) => {  
    res.render('homepage');
});

// export the router
module.exports = router; 