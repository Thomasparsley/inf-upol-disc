import { 
    VOC_InvalidDomain as VOC_InvalidEmailDomain,
    VOC_IsntChatInputCommand,
    VOC_NonValidEmail,
    VOC_NonValidUrl,
    VOC_Unauthorized,
} from "./vocabulary"

export class UnrepliableInteractionError extends Error {
    constructor() { super() }
}

export class UnknownCommandError extends Error {
    constructor() { super() }
}

export class UnauthorizedError extends Error {
    constructor() { super(VOC_Unauthorized) }
}

export class InvalidURLError extends Error {
    constructor() { super(VOC_NonValidUrl) }
}

export class InvalidEmailFormatError extends Error {
    constructor(email: string) { super(VOC_NonValidEmail(email)) }
}

export class UnknownUpolEmailError extends Error {
    constructor(email: string) { super(VOC_InvalidEmailDomain(email)) }
}

export class BadInputForChatCommandError extends Error {
    constructor() { super(VOC_IsntChatInputCommand) }
}
