import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
    type: "varchar",
    length: 255,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
  })
  password: string;

  @Column({
    type: "enum",
    enum: ["admin", "customer", "manager"],
    default: "customer",
  })
  role: string;
}
