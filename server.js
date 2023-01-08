var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
const { DefaultSerializer } = require('v8');

var app = express();
app.set('port', 3000);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use (cookieParser());
app.use (session({
    key: 'user_sid',
    secret: 'somesecret',
    resave: false,
    saveUninitialized: DefaultSerializer,
    cookie: {
        expires: 600000
    }
}));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', "hbs");

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user){
        res.clearCookie('user_sid');
    }
    next();
});

var hbsContent = {userName: '', loggedin: false, title: "You are not logged in today", body: "Hello Worls"};
// middleware function to check for logged in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid){
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// route for homepage
app.get ('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

app.router ('/signup')
    .get((req, res) => {
        //res.sendFile(__dirname + '/public/signup.html')
        res.render('signup', hbsContent);
    })
    .post((req, res) => {
        user.create ({
            username: req.body.username,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');

        })
        .catch(error => {
            res.redirect ('/signup');
        });
    });
// route for login page

app.router ('/login')
    .get((req, res) => {
        //res.sendFile(__dirname + '/public/login.html')
        res.render('login', hbsContent);
    })
    .post((req, res) => {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne ({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword((password))) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
    });

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = "You are logged in";
        //res.sendFile(__dirname + '/public/dashboard.html');
        res.render('index', hbsContect);
    } else{
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = false;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = "You are logged out";
        res.clearCookies (user_sid);
        res.redirect ('/');
    } else{
        res.redirect('/login');
    }
});

// route for handling 404 requests
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`))