require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
   return res.status(403).json({message: "Access denied"})
  }

  jwt.verify(token, JWT, (error, user) => {
    if(error) {
      return res.status(403).json({message: "Access denied"})
    }

    req.user = user;
    next();
  })
}

module.exports = authenticateJWT;