import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Entity,
    Column,
} from "typeorm";

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 320 })
    email!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
