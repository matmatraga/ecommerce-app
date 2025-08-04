const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");

const PORT = process.env.PORT || 3000;

const app = express();

// MONGODB CONNECTION
connectDB();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);

app.use(errorHandler); // Error handling middleware

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${PORT}`));

