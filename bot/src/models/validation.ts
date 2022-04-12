import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Entity,
    Column,
} from "typeorm";

@Entity()
export class Validation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 320 })
    email!: number;

    @Column({ length: 6 })
    key!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    expiresAt!: Date;
}