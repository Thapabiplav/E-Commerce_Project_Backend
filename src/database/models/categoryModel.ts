
import { Column,Table,Model, DataType } from "sequelize-typescript";

@Table({
  modelName:'category',
  tableName:'categories',
  timestamps:true
})

class Category extends Model{
  @Column({
  primaryKey:true,
  type:DataType.UUID,
  defaultValue:DataType.UUIDV4
  })
  declare id:string;

  @Column({
    type:DataType.STRING
  })
  declare categoryName:string
}

export default Category