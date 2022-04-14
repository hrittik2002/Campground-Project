const exprss = require('express');
const router = exprss.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.js')
const users = require('../controllers/users.js')

// register
router.get('/register', users.renderRgister);

router.post('/register', catchAsync(users.register));

// login
router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//logout
router.get('/logout' , users.logout)

module.exports = router;


