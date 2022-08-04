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

    @Column("varchar", { length: 40 })
    user!: string;

    @Column("varchar", { length: 6 })
    key!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    expiresAt!: Date;
}
