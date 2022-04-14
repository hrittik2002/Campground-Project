const exprss = require('express');
const router = exprss.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.js')
const users = require('../controllers/users.js')

// register
router.route('/register')
    .get(users.renderRgister)
    .post(catchAsync(users.register))

// login
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//logout
router.get('/logout' , users.logout)

module.exports = router;


