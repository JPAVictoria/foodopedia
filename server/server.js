const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const authRouter = require("./api/auth/register/auth.route"); 
const loginRouter = require("./api/auth/login/auth.route");   

const app = express();


app.use(cors()); 
app.use(bodyParser.json()); 


app.use("/admin", authRouter); 
app.use("/admin", loginRouter); 


app.get("/", (req, res) => {
  res.send("Server is up and running!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
