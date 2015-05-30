var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		index: true,
		match: /.+\@.+\..+/					//inbuilt validator
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		validate : [
			function(password){
				return password.length >=6;
			},
			'Password should be longer'
		]
	},
	role: {
		type: String,
		enum: ['Admin','Owner','User']      //inbuilt validator
	},
	created: {
		type: Date,
		default: Date.now
	},
	website: {
		type: String,
		get: function(url){
			if(!url){
				return url;
			}else {
				if(url.indexOf('http://')!== 0 && url.indexOf('https://')!==0){
					url = 'http://' + url ;
				}
			return url;	
			}
		}
	}
});

//Example of a virtual attribute..calculated dynamically
UserSchema.virtual('fullName').get(function(){
	return this.firstName + '' + this.lastName;
});

mongoose.model('User', UserSchema);
UserSchema.set('toJSON', {getters:true, virtuals:true});

//A prototype of model static method which searches a user by username property
UserSchema.statics.findOneByUsername = function(username, callback)
{
	this.findOne({username: new RegExp(username,'i')}, callback);
};

//A prototype of custome instance method
UserSchema.methods.authenticate = function(password){
	return this.password === password;	
};