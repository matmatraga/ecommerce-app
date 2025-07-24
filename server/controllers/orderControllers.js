const Order = require("../models/Order.js");
const Cart = require("../models/Cart.js");

const auth = require("../auth.js");

// Create Order
module.exports.createOrder = async (request, response) => {
    let userData;

    try {
        userData = auth.decode(request.headers.authorization);
    } catch (error) {
        return response.status(401).send({ error: "Unauthorized", details: error.message });
    }

    if (userData.isAdmin) {
        return response.status(403).send({ message: "For non-admin users only!" });
    }

    try {
        const cart = await Cart.findOne({ userId: userData.id }).populate({
            path: 'products',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        });

        if (!cart) {
            return response.status(404).send({ message: "Cart not found." });
        }

        let subTotal = cart.products.reduce((sum, product) => sum + (product.quantity * product.productId.price), 0);
        const salesTax = subTotal * 0.12;
        const shippingFee = 40;
        const total = subTotal + salesTax + shippingFee;

        const formattedProducts = cart.products.map(product => ({
            productId: product.productId.id,
            quantity: product.quantity
        }));

        await Cart.findByIdAndDelete(cart._id.toString());

        const newOrder = new Order({
            userId: userData.id,
            products: formattedProducts,
            totalAmount: total
        });

        await newOrder.save();
        response.status(201).send({ message: "Ordered Successfully" });
    } catch (error) {
        response.status(500).send({ error: "Internal Server Error", details: error.message });
    }
};


// Retrive Login (Authenticated) User's Order
module.exports.getAuthenticatedUserOrders = (request, response) => {

	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}


	if (!userData.isAdmin) {
		Order.find({ userId: userData.id })
			.then(orders => {
				response.send(orders)
			})
			.catch(error => response.send(error))
	} else {
		return response.send("For non-admin users only!")
	}
}


// Retrieve All Orders

module.exports.getAllOrders = (request, response) => {

	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		Order.find({})
			.then(orders => {
				if (orders.length === 0) {
					return response.send("No orders found.")
				} else {
					return response.send(orders)
				}
			})
			.catch(error => response.send(error))
	} else {
		return response.send("You don't have an access.")
	}
}
