const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const usersRoutes = require("./routes/usersRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");

const app = express();

// MONGODB CONNECTION
mongoose.connect(process.env.MONGODB_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error, can't connect to the db!"))

db.once("open", () => console.log('Connected to the cloud database!'))

// MIDDLEWARES

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT || 3000}!`))

