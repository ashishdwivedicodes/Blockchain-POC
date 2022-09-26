const mongoose = require('mongoose');
const Schema = mongoose.Schema;


userSchema = new Schema( {
	role: String,
	unique_id: Number,
	firstname:String,
	lastname:String,
	email: String,
	password: String,
	passwordConf: String,
	createdAt: {
		type: Date
	}
}),
User = mongoose.model('User', userSchema);



module.exports = User;