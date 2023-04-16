if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const Post = require('./models/survey');
const User = require('./models/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const authControllers = require('./controllers/auth');

const port = 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Database connection
const dbURL = process.env.dbURL || 'mongodb://127.0.0.1:27017/passportApp';
mongoose.connect(dbURL)
    .then(() => {
        console.log('database connected');
    })
    .catch((e) => {
        console.log(`Error!!!  ${e}`);
    })

//Middleware and Sessions
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
	name: '_session_',
	secret: 'better___Secret',
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expires: Date.now() + 1000*60*60*24*7,
		maxAge:  1000*60*60*24*7
	}
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	console.log('User:- ',req.user);
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})


//Routes
app.get('/',(req, res) => {
    res.render('home')
})

app.get('/register', authControllers.renderRegister)

app.post('/register', authControllers.register)

app.get('/login', authControllers.renderLogin)

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login?q=failed'}), authControllers.login)

app.get('/logout', authControllers.logout)

app.get('/survey1',authControllers.isAuthenticated , (req, res) =>{
    res.render('posts/survey')
})

app.post('/survey1',authControllers.isAuthenticated, async (req, res) => {
    const post = new Post(req.body);
    await post.save();
	console.log(req.body)
	res.render('errors/thankyou')
})

//Listing
app.listen(port, (e) => {
 console.log(`listing to port ${port}`);
})