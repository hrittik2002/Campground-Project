const exprss  = require('express');
const router = exprss.Router({ mergeParams : true });

const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

const {reviewSchema} = require('../schemas.js');

const ExpressError = require('../utils/ExpressError.js')
const catchAsync = require('../utils/catchAsync.js')


/**
 * ***********************************************************
 *  -------------        MIDDLEWARE           ----------------
 * ***********************************************************
 */
 const validateReview = (req , res , next) =>{
    const {error} = reviewSchema.validate(req.body);
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

// Create a review
router.post('/' , validateReview ,  catchAsync(async (req , res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success' , 'Created a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete a review
router.delete('/:reviewId' , catchAsync(async(req , res) =>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , { $pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Deleted a review!');
    res.redirect(`/campgrounds/${id}`);
}))


/**
 * exporting
 */
module.exports = router;