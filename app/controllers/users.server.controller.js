var User = require('mongoose').model('User');

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