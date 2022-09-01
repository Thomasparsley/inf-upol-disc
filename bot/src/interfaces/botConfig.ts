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

export interface BotConfig {
    chatInputCommands?: ICommand<ChatInputCommand>[]
    buttonCommands?: ICommand<ButtonCommand>[]
    modalCommands?: ICommand<ModalCommand>[]
    dropdownCommands?: IDropdownCommand<DropdownCommand>[]
    onReady?: OnReadyAction
    onReactionAdd?: OnReactionAddAction
    onReactionRemove?: OnReactionRemoveAction
    onInteractionCreate?: OnInteractionCreateAction
    onGuildMemberAdd?: OnGuildMemberAddAction
}
