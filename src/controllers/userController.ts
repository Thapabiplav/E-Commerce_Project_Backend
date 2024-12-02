import { Request,Response } from "express";
import User from "../database/models/userModel";

 class AuthController{
  public static async registerUser(req:Request,res:Response):Promise<void>{
    const {email,username,password}=req.body
    if(!email || !username || !password){
      res.status(400).json({
        message:"please provide username , email and password"
      })
      return
    }

    await User.create({
      username,
      email,
      password
    })
    res.status(201).json({
      message:"User registered Sucessfully"
    })
  }
}

export default AuthController