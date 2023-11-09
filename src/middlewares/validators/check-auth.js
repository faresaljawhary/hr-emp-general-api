import jwt from "jsonwebtoken";
import config from "./../../config/index.js";

// Middleware function to verify Bearer token
const verifyBearerToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token is missing" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.auth.securityCode);

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token is invalid" });
  }
};

export default verifyBearerToken;
