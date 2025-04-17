const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./api/auth/register/auth.route");
const loginRouter = require("./api/auth/login/auth.route");
const forgotRouter = require("./api/auth/forgot/auth.route");
const resetRouter = require("./api/auth/reset/auth.route");
const contentRouter = require("./api/content/content.route");
const changePasswordRouter = require("./api/changePassword/change.route"); 
const changeNameRouter = require("./api/changeName/change.route"); 

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/admin/register", authRouter);
app.use("/admin/login", loginRouter);
app.use("/admin/forgot", forgotRouter);
app.use("/admin/reset", resetRouter);
app.use("/admin/content", contentRouter);
app.use("/admin/change", changePasswordRouter); 
app.use("/admin/change", changeNameRouter); 


app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
