var express = require('express');
var app = express.Router();
var user = require('../models/user');
var questions = require('../models/que')
var response = require('../models/response')
var marks = require('../models/marks')
function isLogin (req, res, next) {
	console.log(req.session_state.user)
    if (req.session_state.user && req.session_state.user==='anubhav') {
    		 next();

    } else {
         res.redirect('/admin');
}
}

app.get('/',(req,res)=>{
	console.log()
	if(req.session_state.user === 'anubhav' ){
res.render('adminOptions');
	}else{
	res.render('login',{err : ''});
}
});

app.post('/login',(req,res)=>{
	var data =  req.body;
	if(data.username === 'anubhav' && data.password === 'anubhav') {
		req.session_state.user = 'anubhav';
		res.render('adminOptions');
	}else {
		res.render('login',{err : 'wrong username or password' });
	}
});

app.post('/newQue',(req,res)=>{
	(new questions(req.body)).save((err,que)=>{
				if(err){
			res.json({resp : false , error : 'server error!!!',errr : err});
		} else {
			res.redirect('/admin/addQuestion');
;		}
	})
});
app.get('/addQuestion',(req,res)=>{
	questions.find({}).sort({no : 1 }).exec((err,ques)=>{
		if(err){
			 res.render('login',{ err : 'server error'});
		}else{
			res.render('addQuestion',{no : ques.length+1 });
		}
	});

});
app.get('/checkResponse',(req,res)=>{
	response.find({checked : false},{email:1,_id:0},(err,resp)=>{
		if(err){
			 res.render('login',{ err : 'server error'});
		}else{
			console.log(resp);
			res.render('checkResponse',{resp : resp });
		}
	});

});
app.get('/checkResponse/:email',(req,res)=>{
	response.findOne({email : req.params.email},{__v:0,_id:0},(err,resp)=>{
		if(err){
			 res.render('login',{ err : 'server error'});
		}else{
			console.log(resp);
			res.render('checkResponseIndividual',resp);
		}
	});

});
app.post('/marks',(req,res)=>{
	response.findOne({email : req.body.email},(err,resp)=>{
		if(err){
			 res.render('login',{ err : 'server error'});
		}else{

			resp.checked = true;
			resp.save((err)=>{
				if(err){
			 res.render('login',{ err : 'server error'});
		}else {

			var email = req.body.email;
			delete req.body.email;
			var total = 0;
			for(var i in req.body){
				total+= parseInt(req.body[i]);
			}
	/*	console.log(email)
			console.log(total)
			console.log(req.body)
*/
			(new marks({
				email : email,
				total : total,
				marks : req.body
			})).save((err)=>{
				if(err){
			 res.render('login',{ err : 'server error'});
		}else {
			res.redirect('/admin/checkResponse');
		}
			})

		}
			})

		}
	});

})

app.get('/marks',isLogin,(req,res)=>{
	marks.find({},{_id:0,__v:0},(err,marks)=>{
		if(err){
			 res.render('login',{ err : 'server error'});
		}else{
			//console.log(resp);
			res.render('checkResult',{marks : marks });
		}
	})
})

module.exports = app;
