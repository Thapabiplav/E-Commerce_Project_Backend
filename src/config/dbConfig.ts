type Database={
  host:string,
  user:string,
  password:string,
  db:string,
  dialect:'mysql'|'postgres'|'sqlite'
  pool:{
    max:number,
    min:number,
    acquire:number,
    idle:number,
  }
}

const dbConfig:Database={
  host:'localhost',
  user:'root',
  password:'',
  db:'e-commerce_backend',
  dialect:"mysql",
  pool:{
    max:5,
    min:0,
    acquire:10000,
    idle:10000
  }
}

export default dbConfig;