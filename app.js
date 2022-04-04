const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const { shallowCopy } = require('ejs/lib/utils');
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

app.set('views engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))



app.get('/' , (req ,res)=>{
    res.render('home.ejs')
})

app.get('/campgrounds' , async (req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs' , {campgrounds})
})

app.get('/campgrounds/:id' , async( req , res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show.ejs' , { campground });
})


app.listen(3000 , () => {
    console.log("Serving port at 3000")
})