import  { Request } from "express";
import multer from "multer";

const storage=multer.diskStorage({
  destination:function(req:Request,file:Express.Multer.File,cb:any){
    const allowedFileTypes=['image/png','image/jpeg','image/jpg']
    if(!allowedFileTypes.includes(file.mimetype)){
      cb(new Error("This file is not accepted"))
      return
    }
    cb(null,'./src/uploads')
  },
  filename:function(req:Request,file:Express.Multer.File,cb:any){
    cb(null,Date.now() + "-" + file.originalname)
  }
})

export {
  multer,
  storage
}
