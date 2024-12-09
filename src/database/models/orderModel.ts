import { Table,Column,Model, DataType } from "sequelize-typescript";

@Table({
  tableName:"Order",
  modelName:"orders",
  timestamps:true
})

class Order extends Model{
  @Column({
    primaryKey:true,
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4,
    allowNull:false
  })
  declare id:string

  @Column({
    type:DataType.STRING,
    allowNull:false
  })
  declare phoneNumber:string

  @Column({
    type:DataType.STRING,
    allowNull:false
  })
  declare shippingAddress:string

  @Column({
    type:DataType.FLOAT,
    allowNull:false
  })
  declare totalAmount:number

  @Column({
    type:DataType.ENUM('pending','canceled','onTheWay','preparation','delivered'),
    defaultValue:'pending'
  })
  declare orderStatus:string
}

export default Order