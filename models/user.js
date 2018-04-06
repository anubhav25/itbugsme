var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true
    },
    phoneNo :{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('user', userSchema);