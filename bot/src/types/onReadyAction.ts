import { OnReadyArgs } from "../interfaces";

export type OnReadyAction = (args: OnReadyArgs) => Promise<void>
