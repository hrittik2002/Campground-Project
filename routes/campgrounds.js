const exprss  = require('express');
const router = exprss.Router();
const catchAsync = require('../utils/catchAsync.js')
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })

/**
 * ***********************************************************
 *  -------------        ROUTES             ------------------
 * ***********************************************************
 */


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn , upload.array('image') ,validateCampground ,catchAsync(campgrounds.createCampground))
   
router.get('/new' , isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn , isAuthor, upload.array('image') , validateCampground , catchAsync(campgrounds.updateCampground)) // Update a campground
    .delete(isLoggedIn , isAuthor ,catchAsync(campgrounds.deleteCampground)) // delete Campground

router.get('/:id/edit' ,  isLoggedIn , isAuthor ,catchAsync(campgrounds.renderEditForm)) // Edit a campground


/**
 * exporting
 */
module.exports = router;