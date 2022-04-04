const mongoose = require('mongoose');
const campground = require('../models/campground.js');
const Campground = require('../models/campground.js')
const cities = require('./cities.js')
const {places , descriptors} = require('./seedHelper.js');




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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location : `${cities[random1000].city} , ${cities[random1000].state}`,
            title : `${sample(descriptors)}  ${sample(places)}`

        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})