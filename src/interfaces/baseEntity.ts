import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {
  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
