import { OnReadyArgs } from "../interfaces"

/**
 * Type for a function that handles the Discord client switching into a ready state
 */
export type OnReadyAction = (args: OnReadyArgs) => Promise<void>
