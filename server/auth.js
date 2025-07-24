const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.SECRET;

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		isAdmin: user.isAdmin,
		email: user.email
	}

	return jwt.sign(data, secret, {});
}

// VERIFYING
module.exports.verify = (request, response, next) => {

	let token = request.headers.authorization;

	if (token) {

		token = token.slice(7, token.length);


		return jwt.verify(token, secret, (error, data) => {
			if (error) {
				return response.send("Unauthorized access!")
			} else {

				next();
			}
		})
	} else {
		return response.send("No token provided!")
	}

}

// DECRYPTING
module.exports.decode = (token) => {
	token = token.slice(7, token.length);

	return jwt.decode(token, { complete: true }).payload;
}
