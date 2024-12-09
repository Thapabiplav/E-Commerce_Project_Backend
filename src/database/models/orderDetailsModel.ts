import { Table,Column,Model, DataType } from "sequelize-typescript";

@Table({
  tableName:"OrderDetail",
  modelName:"ordersdetails",
  timestamps:true
})

class OrderDetail extends Model{
  @Column({
    primaryKey:true,
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4,
    allowNull:false
  })
  declare id:string

  @Column({
    type:DataType.INTEGER,
    allowNull:false
  })
  declare quantity:number

 
}

export default OrderDetail