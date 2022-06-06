const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	scores: [{
		score: Number,
		date: Date
	}]
});

// Passport-Local Mongoose will add a username, hash and salt field to store the username,
// the hashed password and the salt value.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = {
	User: User
};
