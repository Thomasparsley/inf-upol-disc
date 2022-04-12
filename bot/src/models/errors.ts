import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Column,
    Entity,
} from "typeorm";

@Entity()
export class Errors extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @Column("text")
    error!: string;
}
