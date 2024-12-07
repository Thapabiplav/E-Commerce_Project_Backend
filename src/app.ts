import express,{Application, Request,Response} from "express";
import * as dotenv from 'dotenv'
dotenv.config()

import userRoute from './routes/userRoute'
import productRoute from './routes/productRoute'
import categoryRoute from './routes/categoryRoute'

import adminSeeder from "./adminSeeder";
import categoryController from "./controllers/categoryController";
require('./database/connection')

adminSeeder()

const PORT:number=4000
const app:Application=express()
app.use(express.json())

app.use("",userRoute)
app.use('/admin',productRoute)
app.use('/admin',categoryRoute)

app.listen(PORT,()=>{
  categoryController.seedCategory()
  console.log("Server has started at port",PORT);
})