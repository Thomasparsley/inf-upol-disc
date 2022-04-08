import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from "typeorm";

@Entity()
export class Validation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
