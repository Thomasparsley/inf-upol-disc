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
    onReactionAddAction,
    onReactionRemoveAction,
    OnReadyAction
} from "../types"

export interface BotConfig {
    chatInputCommands?: ICommand<ChatInputCommand>[]
    buttonCommands?: ICommand<ButtonCommand>[]
    modalCommands?: ICommand<ModalCommand>[]
    dropdownCommands?: IDropdownCommand<DropdownCommand>[]
    onReady?: OnReadyAction
    onReactionAdd?: onReactionAddAction
    onReactionRemove?: onReactionRemoveAction
    onInteractionCreate?: OnInteractionCreateAction
    onGuildMemberAdd?: OnGuildMemberAddAction
}
