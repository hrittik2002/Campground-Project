const mongoose = require('mongoose');
const campground = require('../models/campground.js');
const Campground = require('../models/campground.js')
const cities = require('./cities.js')
const { places, descriptors } = require('./seedHelper.js');




mongoose.connect('mongodb://localhost:27017/yelp-camp')

/***
 * If there is error the print connection error
 * else print Database connected
 */
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author : '625522d4f390044b063407cc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dudem9bnz/image/upload/v1650007079/YelpCamp/nwd9qawwosf1q12dfrae.jpg',
                    filename: 'YelpCamp/nwd9qawwosf1q12dfrae'
                }
            ],
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat delectus maiores impedit deleniti. Officiis praesentium nihil excepturi quidem! Laborum itaque voluptatibus voluptatem hic et!',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            }

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})