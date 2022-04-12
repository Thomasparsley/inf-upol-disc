import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";

@Entity()
export class Validation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    expiresAt!: Date;
}
