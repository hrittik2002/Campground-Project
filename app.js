const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js')
const {campgroundSchema , reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync.js')
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');

const campgrounds = require('./routes/campgrounds.js')
/**
 * ***********************************************
 *                DATABASE WORK
 * ***********************************************
 */

mongoose.connect('mongodb://localhost:27017/yelp-camp')

/***
 * If there is error the print connection error
 * else print Database connected
 */
const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error:"))
db.once("open" , () =>{
    console.log("Database connected")
});


const app = express();

app.engine('ejs' , ejsMate);
app.set('views engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'));

/**
 * Middlewares
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

app.use("/campgrounds" , campgrounds)

app.get('/' , (req ,res)=>{
    res.render('home.ejs')
})

// Create a review
app.post('/campgrounds/:id/reviews' , validateReview ,  catchAsync(async (req , res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete a review
app.delete('/campgrounds/:id/reviews/:reviewId' , catchAsync(async(req , res) =>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , { $pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


// error handling
app.all('*' , (req , res , next) => {
    next(new ExpressError('Page Not Found' ,404))
})

app.use((err , req , res , next)=>{
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error.ejs' , { err });
})

app.listen(3000 , () => {
    console.log("Serving port at 3000")
})