import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Entity,
    Column,
} from "typeorm"

/**
 * Database model representing a validation of a user
 */
/* eslint-disable */
@Entity()
export class Validation extends BaseEntity {
    /**
     * ID of the model
     */
    @PrimaryGeneratedColumn()
    id!: number

    /**
     * ID of the user that is being validated
     */
    @Column("varchar", { length: 40 })
    user!: string

    /**
     * Correct code for the validation of this user
     */
    @Column("varchar", { length: 6 })
    key!: string

    /**
     * When was this validation created
     */
    @CreateDateColumn()
    createdAt!: Date

    /**
     * When does this validation expire
     */
    @Column()
    expiresAt!: Date
}
/* eslint-enable */
