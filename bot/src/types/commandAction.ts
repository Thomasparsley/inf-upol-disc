import { CommandArgs } from "../interfaces";

export type CommandAction = (args: CommandArgs) => Promise<void>
