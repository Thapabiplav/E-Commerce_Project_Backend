import { Sequelize,DataTypes } from "sequelize";
import dbConfig from "../config/dbConfig";
const sequelize=new Sequelize(dbConfig.db,dbConfig.user,dbConfig.password,{
  host:dbConfig.host,
  dialect:dbConfig.dialect,
  port:3306,
  pool:{
    min:dbConfig.pool.min,
    max:dbConfig.pool.max,
    acquire:dbConfig.pool.acquire,
    idle:dbConfig.pool.idle
  }
})

sequelize.
authenticate().
then(()=>{
  console.log("connected");
})
.catch((err)=>{
  console.log(err);
})

const db:any={}
db.Sequelize=Sequelize;
db.sequelize=sequelize

db.sequelize.sync({force:false}).then(()=>{
  console.log("Migrated Sucessfully");
})

export default db;