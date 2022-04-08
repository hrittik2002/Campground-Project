const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js')
const {campgroundSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync.js')
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');
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

app.get('/' , (req ,res)=>{
    res.render('home.ejs')
})

app.get('/campgrounds' , catchAsync(async (req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs' , {campgrounds})
}))


// Create new Campground 
app.get('/campgrounds/new' , (req , res) => {
    res.render('campgrounds/new.ejs');
})

app.post('/campgrounds' , validateCampground , catchAsync(async (req , res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//  Reading data From Database
app.get('/campgrounds/:id' , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show.ejs' , { campground });
}))


// Editing existing data in the database
app.get('/campgrounds/:id/edit' , catchAsync(async( req , res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs' , { campground });
}))

app.put('/campgrounds/:id' , validateCampground , catchAsync(async(req , res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))


// Deleting a campground
app.delete('/campgrounds/:id' , catchAsync(async(req , res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

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