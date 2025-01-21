const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified; // Attach user data (e.g., userId) to request object
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticate;


