const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const authRouter = require("./api/auth/register/auth.route");
const loginRouter = require("./api/auth/login/auth.route");
const forgotRouter = require("./api/auth/forgot/auth.route");
const resetRouter = require("./api/auth/reset/auth.route");

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use("/admin/register", authRouter); 
app.use("/admin/login", loginRouter); 
app.use("/admin/forgot", forgotRouter); 
app.use("/admin/reset", resetRouter); 

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
