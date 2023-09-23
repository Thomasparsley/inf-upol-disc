import {
    ICommand,
    ButtonCommand,
    ChatInputCommand,
    IDropdownCommand,
    DropdownCommand,
    ModalCommand,
} from "../command";
import {
    OnGuildMemberAddAction,
    OnInteractionCreateAction,
    OnReactionAddAction,
    OnReactionRemoveAction,
    OnReadyAction
} from "../types"

/**
 * Interface representing the configuration, specifically the different commands and events the bot currently has
 */
export interface BotConfig {
    /**
     * Commands that are invoked in the chat by users
     */
    chatInputCommands?: ICommand<ChatInputCommand>[]
    /**
     * Commands that are invoked by a user pressing a button
     */
    buttonCommands?: ICommand<ButtonCommand>[]
    /**
     * Commands that are invoked by a user submitting a modal
     */
    modalCommands?: ICommand<ModalCommand>[]
    /**
     * Commands that are invoked by a user selecting one or more items in a dropdown
     */
    dropdownCommands?: IDropdownCommand<DropdownCommand>[]
    /**
     * Function that runs when the underlying Discord client is ready
     */
    onReady?: OnReadyAction
    /**
     * Function that runs when the bot detects a new reaction being added to a message
     */
    onReactionAdd?: OnReactionAddAction
    /**
     * Function that runs when the bot detects user removing a reaction from a message
     */
    onReactionRemove?: OnReactionRemoveAction
    /**
     * Function that runs when a new interaction is created
     */
    onInteractionCreate?: OnInteractionCreateAction
    /**
     * Function that runs when a new user joins a guild (server) the bot has access to
     */
    onGuildMemberAdd?: OnGuildMemberAddAction
}
