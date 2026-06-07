const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { globalLimiter } = require("./middleware/rateLimiters");

const usersRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const webhookRoutes = require("./routes/webhookRoutes.js");

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Webhooks need the raw request body for signature verification, so they are
// mounted before the JSON body parser.
app.use("/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
