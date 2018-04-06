var mongoose = require('mongoose');
var queSchema = new mongoose.Schema({
    que: {
        type: String,
        required : true
    },
    program :{
        type: String,
        required: true
    },
    no: {
        type: Number,
        required: true
    }

});
module.exports = mongoose.model('que', queSchema);