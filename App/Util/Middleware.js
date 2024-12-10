const { VerifyToken } = require("./JWTToken");

const Middleware = async (req, res, next) => {
  try {
    const header = req.header("x-auth-token");
    if (!header) {
      return res.status(403).json({ message: "x-auth-token header missing" });
    }
    const decoded = VerifyToken(header);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { Middleware };
