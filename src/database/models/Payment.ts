import { Table,Column,Model, DataType } from "sequelize-typescript";

@Table({
  tableName:"Payment",
  modelName:"payments",
  timestamps:true
})

class Payment extends Model{
  @Column({
    primaryKey:true,
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4,
    allowNull:false
  })
  declare id:string

  @Column({
    type:DataType.ENUM('Khalti',"E-esewa",'cod'),
    allowNull:false
  })
  declare paymentMethod:string

  
  @Column({
    type:DataType.ENUM('paid','unpaid'),
    defaultValue:'unpaid'
  })
  declare paymentStatus:string

  @Column({
    type:DataType.STRING,

  })
  declare pidx:string
}




export default Payment