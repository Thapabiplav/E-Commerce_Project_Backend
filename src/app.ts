import express,{Application, Request,Response} from "express";
import * as dotenv from 'dotenv'
dotenv.config()

import userRoute from './routes/userRoute'
import productRoute from './routes/productRoute'
import adminSeeder from "./adminSeeder";
require('./database/connection')

adminSeeder()

const PORT:number=4000
const app:Application=express()
app.use(express.json())

app.use("",userRoute)
app.use('/admin',productRoute)

app.listen(PORT,()=>{
  console.log("Server has started at port",PORT);
})