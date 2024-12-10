const jwt = require("jsonwebtoken");
const Environment = require("../Configuration/Environment");

function VerifyToken(token) {
  try {
    const decoded = jwt.verify(token, Environment.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
}

module.exports = {
  VerifyToken,
};
