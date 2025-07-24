const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "user ID is required!"]
	},
	products: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required!"]
			},
			quantity: {
				type: Number,
				default: 1
			}
		}
	]
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;