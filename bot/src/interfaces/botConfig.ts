import { ButtonCommand, ChatInputCommand, ModalCommand } from "../command";
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
    onReady?: OnReadyAction;
    onReactionAdd?: onReactionAddAction;
    onReactionRemove?: onReactionRemoveAction;
    onInteractionCreate?: OnInteractionCreateAction;
    onGuildMemberAdd?: OnGuildMemberAddAction;
}
