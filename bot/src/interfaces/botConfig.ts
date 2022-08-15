import { ButtonCommand, ChatInputCommand, DropdownCommand, ModalCommand } from "../command";
import {
    OnGuildMemberAddAction,
    OnInteractionCreateAction,
    onReactionAddAction,
    onReactionRemoveAction,
    OnReadyAction
} from "../types";

export interface BotConfig {
    chatInputCommands?: ChatInputCommand[];
    buttonCommands?: ButtonCommand[];
    modalCommands?: ModalCommand[];
    dropdownCommands?: DropdownCommand[];
    onReady?: OnReadyAction;
    onReactionAdd?: onReactionAddAction;
    onReactionRemove?: onReactionRemoveAction;
    onInteractionCreate?: OnInteractionCreateAction;
    onGuildMemberAdd?: OnGuildMemberAddAction;
}
