const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");

const PORT = process.env.PORT || 4000;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);
app.use("/upload", uploadRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
