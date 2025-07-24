const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Email is required!"]
	},
	description: {
		type: String,
		required: [true, "Password is required!"]
	},
	img: {
		type: String,
		required: [true, "Image is required!"]
	},
	price: {
		type: Number,
		required: [true, "Price is required!"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;