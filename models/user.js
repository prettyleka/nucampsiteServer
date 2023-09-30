const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
//passport
// const userSchema = new Schema({
//     admin: {
//         type: Boolean,
//         default: true
//     }
// });

//mongoose-population
const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: true
    }
});

// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     admin: {
//         type: Boolean,
//         default: true
//     }
// });

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);