import {
    Client,
    Guild,
    InteractionResponse,
    NonThreadGuildBasedChannel,
    User
} from "discord.js"
import { DataSource } from "typeorm"
import {
    ButtonCommand,
    ChatInputCommand,
    DropdownCommand,
    ModalCommand,
} from "../command"
import { Mailer } from "../mailer"
import { RoleName } from "../types"

export interface CommandArgs<T> {
    client: Client
    interaction: T
    commands: Map<string, ChatInputCommand>
    buttons: Map<string, ButtonCommand>
    modals: Map<string, ModalCommand>
    dropdown: Map<string, DropdownCommand>
    db: DataSource
    mailer: Mailer
    commandRegistration: (commands: ChatInputCommand[]) => Promise<void>
    getGuild: () => Guild
    fetchChannelFromGuild: (id: string) => Promise<NonThreadGuildBasedChannel>
    reply: (content: string) => Promise<void | InteractionResponse<boolean>>
    replySilent: (content: string) => Promise<void | InteractionResponse<boolean>>
    permissionRolesCount: (predicate: Function) => boolean
    addRoleToTarget: (fieldNameOfTarget: string, nameOfRoleToAdd: RoleName, allowedRoles: RoleName[]) => Promise<void>
    hasRole: (roleName: RoleName) => boolean
    flag?: string
}
