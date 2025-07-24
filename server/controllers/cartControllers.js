const Cart = require("../models/Cart.js");
const auth = require("../auth.js");

// added products
module.exports.addedProducts = async (request, response) => {
	const user = auth.decode(request.headers.authorization);
	if (user.isAdmin) return response.send({ error: 'For non-admin users only!' });

	const cart = await Cart.findOne({ userId: user.id });
	if (!cart) {
		const newCart = new Cart({
			userId: user.id,
			products: request.body
		});
		const saveCart = await newCart.save();
		return response.send(saveCart);
	}
	let cartProducts = [];

	if (cart?.products) {
		cartProducts = cart.products;
	}

	const productIndex = cartProducts.findIndex(
		(product) => product.productId === request.body.productId
	);

	if (productIndex !== -1) {
		const currentProduct = cartProducts[productIndex];
		const updatedProductQuantity = {
			productId: currentProduct.productId,
			quantity: currentProduct.quantity + request.body.quantity
		};

		cartProducts[productIndex] = updatedProductQuantity;
	} else {
		cartProducts.push(request.body);
	}

	const updateCart = await Cart.findOneAndUpdate({ userId: user.id }, { products: cartProducts });
	return response.send(updateCart);
};

// Get user cart

module.exports.getUserCart = (request, response) => {


	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}


	if (!userData?.isAdmin) {
		Cart.findOne({ userId: userData.id })
			.populate({
				path: 'products',
				populate: {
					path: 'productId',
					model: 'Product'
				}
			})
			.then((cart) => {
				response.send(cart);

			}).catch((error) => response.send(error))
	} else {
		return response.send("For non-admin users only!")
	}
};

// Change product quantities
module.exports.changeProductQuantities = (request, response) => {

	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}

	if (!userData.isAdmin) {
		const updatedProductQuantities = {
			userId: userData.id,
			products: request.body.products
		}

		Cart.findOneAndUpdate({ userId: userData.id }, updatedProductQuantities, { new: true })
			.then(result => {
				if (!result) {
					return response.send("Cart not found!")
				} else {
					return response.send("Product quantity has been changed!")
				}
			}).catch(error => response.send(error))
	} else {
		return response.send("For non-admin users only!")
	}
}

// Remove Products from Cart
module.exports.removeCart = (request, response) => {

	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}

	if (!userData.isAdmin) {
		Cart.findOneAndDelete({ userId: userData.id }, { new: true })
			.then(result => {
				if (!result) {
					return response.send("Cart is not found!")
				} else {
					return response.send(result)
				}
			}).catch(error => response.send(error))
	} else {
		return response.send("For non-admin users only!")
	}
}

// Subtotal for each item
module.exports.subTotals = (request, response) => {


	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}


	if (!userData.isAdmin) {
		Cart.findOne({ userId: userData.id })
			.populate({
				path: 'products',
				populate: {
					path: 'productId',
					model: 'Product'
				}
			})
			.then((cart) => {
				const subTotals = cart.products.map((product) => {
					const subtotal = product.quantity * product.productId.price;
					return { name: product.productId.name, subtotal, quantity: product.quantity };
				});

				response.send(subTotals);
			}).catch((error) => response.send(error));
	} else {
		return response.send("For non-admin users only!")
	}
};

// Total Price for All Items

module.exports.totalPrice = (request, response) => {


	let userData;

	try {
		userData = auth.decode(request.headers.authorization);
	} catch (error) {
		return response.send(error.message);
	}


	if (!userData?.isAdmin) {
		Cart.findOne({ userId: userData.id })
			.populate({
				path: 'products',
				populate: {
					path: 'productId',
					model: 'Product'
				}
			})
			.then((cart) => {
				const totalPrice = cart.products.reduce((total, product) => {
					const subtotal = product.quantity * product.productId.price;
					return total + subtotal;
				}, 0);

				response.send({ totalPrice });

			}).catch((error) => response.send(error))
	} else {
		return response.send("For non-admin users only!")
	}
};