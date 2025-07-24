const Users = require("../models/Users.js");
const bcrypt = require("bcrypt");

const auth = require("../auth.js");

// REGISTER
module.exports.registerUser = (request, response) => {
	Users.find({email : request.body.email})
	.then(result => {

		if(result.length > 0){
			return response.send(false)
		}else {
			let newUser = new Users({
				email: request.body.email,
				password: bcrypt.hashSync(request.body.password, 10),
				isAdmin: request.body.isAdmin,
			})

			newUser.save()
			.then(saved => response.send(true))
			.catch(error => response.send(false))
		}

	})
	.catch(error => response.send(false))
}

// LOGIN (user authentication)
module.exports.loginUser = (request, response) => {
	Users.findOne({email : request.body.email})
	.then(result => {
		if(!result){
			return response.send(false)
		}else {
			const isPasswordCorrect = bcrypt.compareSync(request.body.password, result.password)

			if(isPasswordCorrect){
				return response.send({
				auth : auth.createAccessToken(result)
				})
			}else{
				return response.send(false)
			}
		}
	}).catch(error => response.send(false))
}


// RETRIEVING USER DETAILS
module.exports.getProfile = (request, response) => {

	const userData = auth.decode(request.headers.authorization);

	const userId = userData.id;

	if(userData.isAdmin || userId){
		Users.findById(userId)
		.then(result => {
			result.password = ""
			if(!result){
			return response.send(true)
			}else{
				return response.send(false)
			}
		}).catch(error => response.send(false))
	}else{
		return response.send(false)
	}
}

// Set user as Admin
module.exports.setUserAsAdmin = (request, response) => {

	const userId = request.params.id;

	const userData = auth.decode(request.headers.authorization);

	if(userData.isAdmin && userId){
		Users.findByIdAndUpdate(userId, {isAdmin: true}, {new: true})
		.then(result => {
			if(result){
				return response.send(true)
			}else{
				return response.send(false)
			}
		}).catch(error => response.send(error))
	}else{
		return response.send(false)
	}
}

module.exports.retrieveUserDetails = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	Users.findOne({_id : userData.id})
	.then(data => response.send(data));
}
