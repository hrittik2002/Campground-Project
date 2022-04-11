const exprss  = require('express');
const router = exprss.Router();
const catchAsync = require('../utils/catchAsync.js')
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js')
const Campground = require('../models/campground.js');

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
router.get('/new' , (req , res) => {
    res.render('campgrounds/new.ejs');
})

router.post('/' , validateCampground , catchAsync(async (req , res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//  Reading data From Database
router.get('/:id' , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show.ejs' , { campground });
}))


// Editing existing data in the database
router.get('/:id/edit' , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs' , { campground });
}))

router.put('/:id' , validateCampground , catchAsync(async(req , res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))


// Deleting a campground
router.delete('/:id' , catchAsync(async(req , res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))



/**
 * exporting
 */
module.exports = router;