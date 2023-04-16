const User = require('../models/users');

module.exports.renderRegister = (req, res) =>{
    res.render('auth/register')
}

module.exports.register = async(req, res) =>{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash('success', 'well done, you are member now')
    res.redirect('/login')
}

module.exports.renderLogin = (req, res) =>{
    res.render('auth/login')
}

module.exports.login = async(req, res) =>{
    req.flash('success', 'welcome back')
    res.redirect('/')
}

module.exports.logout = (req, res) => {
    req.logout((err)=>{
        if(err){ return next(err)}
        req.flash('success', "Goodbye!");
        res.redirect('/');
    })
}

module.exports.isAuthenticated = (req, res, next) => {
    if(!req.user){
        req.flash('error', "The page you trying to view is required an authentication");
        res.redirect('/login')
    }else{
        next()
    }
}