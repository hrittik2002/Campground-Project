const exprss  = require('express');
const router = exprss.Router();
const catchAsync = require('../utils/catchAsync.js')
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js')
const Campground = require('../models/campground.js');
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')

/**
 * ***********************************************************
 *  -------------        ROUTES             ------------------
 * ***********************************************************
 */


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn ,validateCampground , catchAsync(campgrounds.createCampground))

router.get('/new' , isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn , isAuthor ,validateCampground , catchAsync(campgrounds.updateCampground)) // Update a campground
    .delete(isLoggedIn , isAuthor ,catchAsync(campgrounds.deleteCampground)) // delete Campground

router.get('/:id/edit' ,  isLoggedIn , isAuthor ,catchAsync(campgrounds.renderEditForm)) // Edit a campground


/**
 * exporting
 */
module.exports = router;