export class UnrepliableInteractionError extends Error {
    constructor() { super() }
}

export class UnknownCommandError extends Error {
    constructor() { super() }
}

export class UnauthorizedError extends Error {
    constructor() {
        super("Nemáš oprávnění pro tento příkaz!")
    }
}

export class InvalidURLError extends Error {
    constructor() {
        super("Nepředal jsi validní URL.")
    }
}

export class InvalidTextBasedChannel extends Error {
    constructor() {
        super("Nelze najít příslušný textový kanál.")
    }
}

export class InvalidChannel extends Error {
    constructor() {
        super("Nelze najít příslušný kanál.")
    }
}

export class InvalidGuild extends Error {
    constructor() {
        super("Nelze najít příslušnou guildu.")
    }
}

export class InvalidEmailFormatError extends Error {
    constructor(email: string) {
        super(`Email není ve správném tvaru ${email}.`)
    }
}

export class UnknownUpolEmailError extends Error {
    constructor(email: string) {
        super(`${email} napatří do domény Univerzity Palackého. Registrace je jen pro emaily typu \`uživatel@upol.cz\`.`)
    }
}

export class BadInputForChatCommandError extends Error {
    constructor() {
        super("Příkaz nelze zpracovat.")
    }
}

export class BotCanEditOnlySelfMessagesError extends Error {
    constructor() {
        super("Bot může upravovat jen svoje zprávy!")
    }
}
