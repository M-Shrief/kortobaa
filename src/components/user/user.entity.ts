import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
// Entites
import { BaseEntity } from "../../interfaces/baseEntity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50 })
  name!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  phone!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;
}

export enum ERROR_MSG {
  NOT_FOUND = "User's not found",
  NOT_VALID = "Data for User is not valid",
  // Inner properties
  NAME = "name should be contain letters, and less than 50 in length",
  PHONE = "phone not right or not supported",
  ADDRESS = "address can not be empty",
  PASSWORD = "Password should contain: lowercase and uppercase letters, numbers, and symbols(*&^%%$#!@)",
}
