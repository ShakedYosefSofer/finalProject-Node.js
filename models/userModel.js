const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log(process.env.TOKEN_SECRET);
const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
role:{
    type:String, default:"user"
  }
},{timestamps:true})





exports.UserModel = mongoose.model("users",userSchema)

// create Token
exports.createToken = (user_id,role) => {

  const token = jwt.sign({_id:user_id,role},process.env.TOKEN_SECRET,
  {expiresIn:"180mins"});
  return token;
}


exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).max(400).required(),
    email:Joi.string().min(2).max(400).email().required(),
    password:Joi.string().min(3).max(400).required(),
  })
  return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email:Joi.string().min(2).max(400).email().required(),
    password:Joi.string().min(3).max(400).required()
  })
  return joiSchema.validate(_reqBody)
}

