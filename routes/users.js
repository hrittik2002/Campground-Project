const exprss = require('express');
const router = exprss.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.js')

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
    } catch(e){
        req.flash('error' , e.message);
        res.redirect('register')
    }
}));

module.exports = router;


