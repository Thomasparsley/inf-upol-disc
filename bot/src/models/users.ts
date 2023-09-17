import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Entity,
    Column,
} from "typeorm"

/**
 * Database model representing a user
 */
/* eslint-disable */
@Entity()
export class User extends BaseEntity {
    /**
     * ID of the model (this is not an actual user ID!)
     */
    @PrimaryGeneratedColumn()
    id!: number

    /**
     * Email of this user
     */
    @Column("varchar", { length: 320 })
    email!: number

    /**
     * When was this user inserted into the database
     */
    @CreateDateColumn()
    createdAt!: Date
}
/* eslint-enable */
