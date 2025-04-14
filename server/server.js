const express = require("express");
const cors = require("cors");

const authRouter = require("./api/auth/register/auth.route");
const loginRouter = require("./api/auth/login/auth.route");
const forgotRouter = require("./api/auth/forgot/auth.route");
const resetRouter = require("./api/auth/reset/auth.route");
const contentRouter = require("./api/content/content.route");

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only localhost:3000
  credentials: true,  // Allow cookies and credentials
};

// Middleware
app.use(cors(corsOptions));  // Use CORS with options
app.use(express.json());  // Parse incoming JSON data

// Use routes
app.use("/admin/register", authRouter);
app.use("/admin/login", loginRouter);
app.use("/admin/forgot", forgotRouter);
app.use("/admin/reset", resetRouter);
app.use("/admin/content", contentRouter);

// Basic health check
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
