import { OnInteractionCreateArgs } from "../interfaces"

/**
 * Type for a function that handles a new interaction being created
 */
export type OnInteractionCreateAction = (args: OnInteractionCreateArgs) => Promise<void>
