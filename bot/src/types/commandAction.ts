import { CommandArgs } from "../interfaces"

export type CommandAction<T> = (args: CommandArgs<T>) => Promise<void>
