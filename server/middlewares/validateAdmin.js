const validateAdmin = (req, res, next) => {

  
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords does not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  next();
};

module.exports = { validateAdmin };  
