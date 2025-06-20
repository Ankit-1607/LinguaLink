import jwt from 'jsonwebtoken';
import 'dotenv/config';

import User from '../models/User.model.js'

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies['jwt-token'];
    // console.log("Received token: ", token);
    if(!token) 
      return res.status(401).json({
        message: "Unauthorized - Token not present."
      });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decodedToken)
      return res.status(401).json({
        message: "Unauthorized - Invalid token."
      });

    const user = await User.findById(decodedToken.userId).select("-password");
    if(!user)
      return res.status(401).json({
        message: "Unauthorized - User not found."
      });

    req.user = user;
    next();
  } catch(error) {
    console.error("Error in protectRoute middleware", error);
    return res.status(500).json({
      message: "Internal server error."
    })
  }
}