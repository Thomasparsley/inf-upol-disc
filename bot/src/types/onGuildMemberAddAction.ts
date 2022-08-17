import { Awaitable } from "discord.js";
import { OnGuildMemberAddArgs } from "../interfaces";

export type OnGuildMemberAddAction = (args: OnGuildMemberAddArgs) => Awaitable<void>
