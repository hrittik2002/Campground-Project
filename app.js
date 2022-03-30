const express = require('express');
const app = express();
const path = require('path');

app.set('views engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))

app.get('/' , (req ,res)=>{
    res.render('home.ejs')
})
app.listen(3000 , () => {
    console.log("Serving port at 3000")
})