var express = require('express');
var app = express.Router();
var users = require('../models/user');
var questions = require('../models/que')
var response = require('../models/response')

function isLogin (req, res, next) {
	console.log(req.session_state.user)
    if (req.session_state.user) {
    	if( req.session_state.user.email){
    		console.log("anubhav" + req.session_state.user.email)
    		 next();
    	}
else {
         res.redirect('/');
}
    } else {
         res.redirect('/');
}
}

/* GET home page. */
app.get('/', function(req, res, next) {
	req.session_state.reset();
  res.render('index',{err : ''});
});

app.post('/login',(req,res)=>{
	var data =  req.body;
	response.findOne({email:data.email},{_id : 0, __v : 0},(err,response)=>{
		if(err){
			console.log(err)
			 res.render('index',{ err : 'wrong details'});
		} else if(response){
res.render('index',{ err : 'user already submitted response'});
		}else {
			users.findOne({email:data.email},{_id : 0, __v : 0},(err,user)=>{
		if(err){
			console.log(err)
			 res.render('index',{ err : 'wrong details'});
		} else if(user) {
req.session_state.user = user;
			res.redirect('/questions');
		} else {
				(new users(data)).save((err,user)=>{
		if(err){
			console.log(err)
			 res.render('index',{ err : 'wrong details'});
		}else{
			 req.session_state.user = user;
			res.redirect('/questions');
		}
	});
		}
	})


		}
	});
	
});

app.get('/questions',isLogin,(req,res)=>{
	questions.find({},{_id:0,__v:0}).sort({no : 1 }).exec((err,ques)=>{
		if(err){
			 res.render('index',{ err : 'wrong details'});
		}else{
			res.render('questions',{ques : ques });
		}
	});

});




app.post('/submit',(req,res)=>{
	var data = req.body;
	var obj = {
		email : req.session_state.user.email ,
		answers : data
	};
	(new response(obj)).save((err,myobj)=>{
		if(err){
			res.json({resp : false , error : 'server error!!!'});
		} else {
			console.log(myobj);
	req.session_state.reset();
	res.render('index',{err : 'response submitted'})
		}
	});




})


module.exports = app;
