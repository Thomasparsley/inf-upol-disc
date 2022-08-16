import { Awaitable } from "discord.js";
import { OnGuildMemberAddArgs } from "../interfaces/OnGuildMemberAddArgs";

export type OnGuildMemberAddAction = (args: OnGuildMemberAddArgs) => Awaitable<void>
