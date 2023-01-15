const path = require('path'); 
// importing the path module from node.js, which is used to work with file and directory paths.
const router = require('express').Router(); 
// importing the express router, which allows for the creation of modular, mountable route handlers

// create a GET endpoint for the '/notes' route
router.get('/signup', (req, res) => {  
    res.render('signup');
});

router.get('/login', (req, res) => {  
    res.render('login');
});

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