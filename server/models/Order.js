const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "User ID is required!"]
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
	],
	totalAmount: {
		type: Number,
		required: [true, "Total amount is required!"]
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	},
	status: {
		type: String,
		default: "pending"
	}
})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;