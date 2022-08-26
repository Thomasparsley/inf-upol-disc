import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Column,
    Entity,
} from "typeorm"

/* eslint-disable */
@Entity()
export class Error extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @CreateDateColumn()
    createdAt!: Date

    @Column("text")
    error!: string
}
/* eslint-enable */
