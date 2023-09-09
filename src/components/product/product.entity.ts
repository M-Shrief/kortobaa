import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// Entites
import {User} from '../user/user.entity'
import { BaseEntity } from "../../interfaces/baseEntity";
  
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50 })
	title!: string;

  @Column({ type: "int" })
  price!: number;

  /* Return base64 encoded image 
      rendered in HTML like this 
      <img src=`data:image/png;base64, <!-- Base64 data -->` alt="Red dot" />
  */
  @Column({
    type: "blob",
    transformer: {
      to: (value: string) => Buffer.from(value, 'base64'),
      from: (value: Buffer) => value.toString('base64')
    }
  })
  image!: string;

  @ManyToOne((type) => User, (user) => user.products)
  @JoinColumn({ name: 'user' })
  user!: User;
}

export enum ERROR_MSG {
  NOT_FOUND = "Product's not found",
  NOT_VALID = "Data for Product is not valid",
  // Inner properties
  TITLE = "Title should be contain letters, and less than 50 in length",
  PRICE = "Price should be number",
  IMAGE = "Image have to be base64 string",
  USER = "User's not found",
}
