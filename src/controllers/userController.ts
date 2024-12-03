import { Request,Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
      password:bcrypt.hashSync(password,8)
    })
    res.status(201).json({
      message:"User registered Sucessfully"
    })
  }

  public static async loginUser(req:Request,res:Response):Promise<void>{
    const {email ,password}=req.body
    if(!email || !password){
      res.status(400).json({
        message:"Please provide email and password"
      })
      return
    }

    const [data]= await User.findAll({
      where:{
        email:email
      }
    })
    
    
    if(!data){
      res.status(403).json({
       message:"No user found"
      })
      return
     }
    const isMatched=bcrypt.compareSync(password,data.password)
    if(!isMatched){
     res.status(403).json({
      message:"Invaild email or pasword"
     })
      return
    }
    const token=jwt.sign({id:data.id},'hahah',{
      expiresIn:'20d'
    })
    res.status(200).json({
      message:"Login Sucessfull",
      data:token
    })
   
  }
}

export default AuthController