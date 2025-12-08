const express = require("express");
require("dotenv").config();
const db = require("./db");

const otpRoutes = require("./routes/otp"); 
const authRoutes = require("./routes/auth");

const errorHandler = require("./middleware/errorHandler");
const { authenticate, authorize } = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", require("./routes/products"));
app.use("/users", authenticate, authorize(1), require("./routes/users"));
app.use("/orders", authenticate, authorize(1), require("./routes/orders"));
app.use("/upload", require("./routes/upload"));
app.use("/uploads", express.static("uploads"));
app.use("/otp", otpRoutes); // 


app.get("/", (req, res) => {
  res.send("E-Commerce API is running");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handler
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
