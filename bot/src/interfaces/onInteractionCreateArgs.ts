import { CacheType, Client, Interaction } from "discord.js"
import { DataSource } from "typeorm"
import { ButtonCommand, ChatInputCommand, DropdownCommand, ICommand, IDropdownCommand, ModalCommand } from "../command"
import { Mailer } from "../mailer"
import { Bot } from "../bot"

/**
 * Event arguments for a new interaction being created
 */
export interface OnInteractionCreateArgs {
    /**
     * Client that invoked this event
     */
    client: Client
    /**
     * Interaction that was created
     */
    interaction: Interaction<CacheType>
    /**
     * Chat commands used by the client
     */
    commands: Map<string, ICommand<ChatInputCommand>>
    /**
     * Button commands used by the client
     */
    buttons: Map<string, ICommand<ButtonCommand>>
    /**
     * Modal commands used by the client
     */
    modals: Map<string, ICommand<ModalCommand>>
    /**
     * Dropdown commands used by the client
     */
    dropdown: Map<string, IDropdownCommand<DropdownCommand>>
    /**
     * DataSource instance used for accessing the database
     */
    db: DataSource
    /**
     * Mailer instance used for sending emails
     */
    mailer: Mailer
    /**
     * Function that registers the client's commands so they're usable by users
     * @param commands List of commands that should be registered
     * @returns Promise representing completion of the registration
     */
    commandRegistration: (commands: ICommand<ChatInputCommand>[]) => Promise<void>
    /**
     * Bot instance used by the client
     */
    bot: Bot
}
