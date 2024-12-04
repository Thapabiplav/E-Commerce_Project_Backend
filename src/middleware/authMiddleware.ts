import { NextFunction, Request,Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../database/models/userModel";

interface authData extends Request{
  user?:{
    username:string,
    password:string,
    email:string,
    role:string,
    id:string
  }
}

enum Roles{
  Admin='admin',
  Customer='customer'
}

class AuthMiddleware{
  async isAuthenticated(req:authData,res:Response,next:NextFunction):Promise<void>{
    const token=req.headers.authorization
    if(!token || token=== undefined){
      res.status(400).json({
        message:"Token not verified"
      })
      return
    }
   jwt.verify(token,process.env.SECRET_KEY as string, async(err,decoded:any)=>{
    if(err){
      res.status(400).json({
        message:"Invalid token"
      })
    }
    else{
     try {
      const userData= await User.findByPk(decoded.id)
      if(!userData){
        res.status(401).json({
          message:"No user with that token found"
        })
        return
      }
      req.user=userData
      next()
     } catch (error) {
      res.status(401).json({
        message:"Something went wrong"
      })
     }
    }
   })
  }

  restrictedTo(...roles:Roles[]){
  return(req:authData,res:Response,next:NextFunction)=>{
    let userRole=req.user?.role as Roles
    if(!roles.includes(userRole)){
      res.status(403).json({
        message:"You don't have permission"
      })
    }
    else{
      next()
    }
  }
  }
}

export default new AuthMiddleware