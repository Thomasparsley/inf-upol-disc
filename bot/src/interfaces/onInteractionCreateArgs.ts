import { CacheType, Client, Interaction } from "discord.js"
import { DataSource } from "typeorm"
import { ButtonCommand, ChatInputCommand, Command, DropdownCommand, ModalCommand } from "../command"
import { Mailer } from "../mailer"

export interface OnInteractionCreateArgs {
    client: Client
    interaction: Interaction<CacheType>
    commands: Map<string, ChatInputCommand>
    buttons: Map<string, ButtonCommand>
    modals: Map<string, ModalCommand>
    dropdown: Map<string, DropdownCommand>
    db: DataSource
    mailer: Mailer
    commandRegistration: (commands: ChatInputCommand[]) => Promise<void>
}
