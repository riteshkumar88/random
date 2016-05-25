var express = require('express');
var app = express();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/ys';
MongoClient.connect(url, function(err, db){
	if(err) throw err;

	var users = db.collection('users');
	var query = { };
	var cursor = users.find(query);
	var total,random;

	users.count(function(err, count){

		random = Math.floor(Math.random()*count);
		cursor.sort({_id : -1});
		cursor.skip(random);
		cursor.limit(1);

		cursor.each(function(err, doc){
			if(err) throw err;
			if(doc == null){
				return db.close();
			}
			console.dir(doc);
		});
	});
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
    question: {type: String},
    answer: {type: String}
});

var User = mongoose.model('User', userSchema);


app.get('/home', function(req, res, next){
   MongoClient.connect(url, function(err, db){
   	if(err) throw err;
   var users = db.collection('users');
	var query = { };
	var cursor = users.find(query);
	var total,random;

	users.count(function(err, count){

		random = Math.floor(Math.random()*count);
		cursor.sort({_id : -1});
		cursor.skip(random);
		cursor.limit(1);

		cursor.each(function(err, doc){
			if(err) throw err;
			if(doc == null){
				return db.close();
			}
			res.json(doc);
		
	});
});	
	});
	
});

app.listen(3000, function(err, next){
	if(err) return next(err);
	console.log("Localhost running");
});