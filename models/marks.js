var mongoose = require('mongoose');
var marksSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true
    },
    marks :{
     type: Object,
        required: true
},
total : {
    type: Number,
    required :true
}

});
module.exports = mongoose.model('marks', marksSchema);