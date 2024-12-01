
import express,{Application, Request,Response} from "express";

require('./model/index')

const PORT:number=4000
const app:Application=express()
app.get('/',(req:Request,res:Response)=>{
  res.send("Hello")
})

app.listen(PORT,()=>{
  console.log("Server has started at port",PORT);
})