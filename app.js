const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js')
const methodOverride = require('method-override');


const campgrounds = require('./routes/campgrounds.js')
const reviews = require('./routes/reviews.js')



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

/**
 * ***********************************************
 *                MAIN WORK
 * ***********************************************
 */

const app = express();

app.engine('ejs' , ejsMate);
app.set('views engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname , 'public')))

const sessionConfig = {
    secret : 'apple',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req , res , next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use("/campgrounds" , campgrounds);
app.use("/campgrounds/:id/reviews" , reviews);

app.get('/' , (req ,res)=>{
    res.render('home.ejs')
})

/**
 * ***********************************************
 *                ERROR HANDLING
 * ***********************************************
 */
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