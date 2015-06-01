var User = require('mongoose').model('User'),
	passport = require('passport');
	
//private method | returns unified error message from Mongoose error object
// err.errors - mongoose validation error | err.code - mongoDb indexing error
var getErrorMessage = function(err){
	var message = '';
	
	if (err.code){
		switch(err.code){
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Somwthing went wrong';
		}
	}else{
		for (var errName in err.errors){
			if(err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
};

//Renders the sign-in page
exports.renderSignin = function(req,res,next){
	if(!req.user){
		res.render('signin',{
			title: 'Sign-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	}else
	return res.redirect('/');
};

//Renders the sign-up page
exports.renderSignup = function(req,res,next){
	if(!req.user){
		res.render('signup',{
			title: 'Sign-up Form',
			messages: req.flash('error')
		});
	}else {
		return res.redirect('/');
	}	
};

//To create new users
exports.signup = function(req,res,next){
	if(!req.user){
		var user = new User(req.body);
		var message = null;
		
		user.provider = 'local';
		
		user.save(function(err){
			if(err){
				var message = getErrorMessage(err);
				
				req.flash('error',message);
				return res.redirect('signup');
			}
			req.login(user, function(err){
				if (err) return next(err);
				return res.redirect('/');
			});
		});
	}else {
		return res.redirect('/');
	}	
};

//to sign-out | uses req.logout() of passport module to inavlidate authenticated session 
exports.signout = function(req,res){
	req.logout();
	res.redirect('/');
};

exports.create = function(req,res,next){
	var user = new User(req.body);
	
	user.save(function(err){
		if(err){
			return next(err);
		}else{
			res.json(user);
		}
	});
};

exports.list = function(req,res,next){
	User.find({},function(err,users){
		if(err){
			return next(err);
		}else {
			res.json(users);
		}
	});
};

exports.read = function(req,res){
	res.json(req.user);
};

//finds a user by it's id in HTTP request
exports.userByID = function(req,res,next,id){
	User.findOne({_id: id}, function(err,user){
		if(err){
			return next(err);
		}else {
			req.user = user ;
			next();
		} 
	});	
};

//To update an existing document
//This request is not working...will come back to it
exports.update = function(req,res,next){
	User.findByIdAndUpdate(req.user.id,req.body,function(err,user){
		console.log("Print something goddamit");
		if(err){
			console.log("error");
			return next(err);
		}else {
			console.log("Update successful");
			res.json(user);
		} 
	});
};

//delete a user by it's id
//This is also not working correctly.. will come back to it
exports.delete = function(req,res,next){
	req.user.remove(function(err){
		if(err){
			return next(err);
		}else{
			res.json(req.user);
		}
	});
};