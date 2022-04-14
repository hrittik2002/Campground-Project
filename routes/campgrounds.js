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



router.get('/' , catchAsync(campgrounds.index))


// Create new Campground 
router.get('/new' , isLoggedIn , campgrounds.renderNewForm)

router.post('/' ,  isLoggedIn ,validateCampground , catchAsync(campgrounds.createCampground))

//  Reading data From Database
router.get('/:id' , catchAsync(campgrounds.showCampground))

// Editing existing data in the database
router.get('/:id/edit' ,  isLoggedIn , isAuthor ,catchAsync(campgrounds.renderEditForm))

router.put('/:id' ,  isLoggedIn , isAuthor ,validateCampground , catchAsync(campgrounds.updateCampground))

// Deleting a campground
router.delete('/:id' ,  isLoggedIn , isAuthor ,catchAsync(campgrounds.deleteCampground))



/**
 * exporting
 */
module.exports = router;