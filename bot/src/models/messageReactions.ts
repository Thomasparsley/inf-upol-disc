import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn
} from "typeorm"

/* eslint-disable */
@Entity()
export class MessageReaction extends BaseEntity {
    @PrimaryColumn("varchar", { length: 32 })
    messageId!: string

    @PrimaryColumn("varchar", { length: 32 })
    channelId!: string
    
    @PrimaryColumn("varchar", { length: 64 })
    emoji!: string

    @Column("varchar", { length: 64 })
    role!: string
}
/* eslint-enable */