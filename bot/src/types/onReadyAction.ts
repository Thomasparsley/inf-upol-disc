import { OnReadyArgs } from "../interfaces/OnReadyArgs";

export type OnReadyAction = (args: OnReadyArgs) => Promise<void>
