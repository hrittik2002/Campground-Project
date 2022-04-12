const exprss  = require('express');
const router = exprss.Router();
const catchAsync = require('../utils/catchAsync.js')
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js')
const Campground = require('../models/campground.js');
const {isLoggedIn} = require('../middleware.js')
/**
 * ***********************************************************
 *  -------------        MIDDLEWARE           ----------------
 * ***********************************************************
 */
const validateCampground = (req , res , next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
         throw new ExpressError(msg , 400);
    }
    else{
        next();
    }
}

/**
 * ***********************************************************
 *  -------------        ROUTES             ------------------
 * ***********************************************************
 */

router.get('/' , catchAsync(async (req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs' , {campgrounds})
}))


// Create new Campground 
router.get('/new' , isLoggedIn ,(req , res) => {
    res.render('campgrounds/new.ejs');
})

router.post('/' ,  isLoggedIn ,validateCampground , catchAsync(async (req , res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success' , 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//  Reading data From Database
router.get('/:id' , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error' , 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs' , { campground });
}))


// Editing existing data in the database
router.get('/:id/edit' ,  isLoggedIn , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs' , { campground });
}))

router.put('/:id' ,  isLoggedIn , validateCampground , catchAsync(async(req , res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , { ...req.body.campground });
    req.flash('success' , 'Successfully updated the Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))


// Deleting a campground
router.delete('/:id' ,  isLoggedIn , catchAsync(async(req , res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted the Campground!');
    res.redirect('/campgrounds')
}))



/**
 * exporting
 */
module.exports = router;