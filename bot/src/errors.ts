/**
 * Error thrown when a given interaction cannot be replied to
 */
export class UnrepliableInteractionError extends Error {
    constructor() { super() }
}

/**
 * Error thrown when an unknown command is invoked
 */
export class UnknownCommandError extends Error {
    constructor() { super("Neznámý příkaz.") }
}

/**
 * Error thrown when a user attempts to use a command the don't have access to
 */
export class UnauthorizedError extends Error {
    constructor() {
        super("Nemáš oprávnění pro tento příkaz!")
    }
}

/**
 * Error thrown when an invalid URL is passed to the bot
 */
export class InvalidURLError extends Error {
    constructor() {
        super("Nepředal jsi validní URL.")
    }
}

/**
 * Error thrown when an invalid text channel is specified
 */
export class InvalidTextBasedChannel extends Error {
    constructor() {
        super("Nelze najít příslušný textový kanál.")
    }
}

/**
 * Error thrown when an invalid channel is specified
 */
export class InvalidChannel extends Error {
    constructor() {
        super("Nelze najít příslušný kanál.")
    }
}

/**
 * Error thrown when an invalid guild is specified
 */
export class InvalidGuild extends Error {
    constructor() {
        super("Nelze najít příslušnou guildu.")
    }
}

/**
 * Error thrown when the specified email is not a valid UPOL email
 */
export class UnknownUpolEmailError extends Error {
    constructor(email: string) {
        super(`\`${email}\` napatří do domény Univerzity Palackého. Registrace je jen pro emaily typu \`jmeno.prijmeniXX@upol.cz\`.`)
    }
}

/**
 * Error thrown when the specified chat command receives invalid input
 */
export class BadInputForChatCommandError extends Error {
    constructor() {
        super("Příkaz nelze zpracovat.")
    }
}

/**
 * Error thrown when an attempt is made to edit a message that was not sent by the bot
 */
export class BotCanEditOnlySelfMessagesError extends Error {
    constructor() {
        super("Bot může upravovat jen svoje zprávy!")
    }
}
