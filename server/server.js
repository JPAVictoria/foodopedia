const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./api/auth/auth.route"); // Import your auth route

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Use the auth routes
app.use("/admin", authRouter); // Prefix for your routes, e.g. /admin/signup

// Example route to test if the server is running
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
