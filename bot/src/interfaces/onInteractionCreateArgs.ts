import { CacheType, Client, Interaction } from "discord.js"
import { DataSource } from "typeorm"
import { ButtonCommand, ChatInputCommand, DropdownCommand, ICommand, IDropdownCommand, ModalCommand } from "../command"
import { Mailer } from "../mailer"

export interface OnInteractionCreateArgs {
    client: Client
    interaction: Interaction<CacheType>
    commands: Map<string, ICommand<ChatInputCommand>>
    buttons: Map<string, ICommand<ButtonCommand>>
    modals: Map<string, ICommand<ModalCommand>>
    dropdown: Map<string, IDropdownCommand<DropdownCommand>>
    db: DataSource
    mailer: Mailer
    commandRegistration: (commands: ICommand<ChatInputCommand>[]) => Promise<void>
}
