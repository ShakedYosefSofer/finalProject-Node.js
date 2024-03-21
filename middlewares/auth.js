const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.auth = (req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    // if token not found on header return error
    return res.status(401).json({err:"You need to send token"});
  }
  try{
// add ID to token
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
   
    req.tokenData = decodeToken
// success to next function
    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired"});
  }
}

// validate 
exports.authAdmin = (req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
        // if token not found on header return error
    return res.status(401).json({err:"You need to send token "});
  }
  try{
// hash token
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
// check if user is admin if not return error

    if(decodeToken.role != "admin" && decodeToken.role != "superadmin"){
      return res.status(401).json({err:"Just admin can be in this endpoint"});
    }
    
    req.tokenData = decodeToken
// success to next function
    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired "});
  }
}