var mongoose = require('mongoose');
var responseSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true
    },
    checked:{
        type:Boolean,
        default:false
    },
    answers :{
     type: Object,
        required: true
}

});
module.exports = mongoose.model('response', responseSchema);