import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Column,
    Entity,
} from "typeorm"

/**
 * Database model representing an error
 */
/* eslint-disable */
@Entity()
export class Error extends BaseEntity {
    /**
     * ID of the model
     */
    @PrimaryGeneratedColumn()
    id!: number

    /**
     * When was this error inserted into the database
     */
    @CreateDateColumn()
    createdAt!: Date

    /**
     * Text of the error
     */
    @Column("text")
    error!: string
}
/* eslint-enable */
