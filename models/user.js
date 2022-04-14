const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema);

/***
 * Note here we are using passport so, username and passward the not manually stored by us in the database , passport will store it for us
 */