import User from "./database/models/userModel"
import bcrypt from 'bcrypt'
const adminSeeder=async():Promise<void>=>{
  const [data]=await User.findAll({
    where:{
      email:'p6admin@gmail.com'
    }
  })

  if(!data){
    await User.create({
      email:'p6admin@gmail.com',
      username:"admin",
      password:bcrypt.hashSync('p6admin',8),
      role:'admin'
    })
    console.log("admin credentials seeded successfully");
  }
  else{
    console.log("admin credentials already seeded")
  }

}

export default adminSeeder