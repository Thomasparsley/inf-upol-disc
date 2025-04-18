interface String {
    /**
     * Converts the string to an error
     */
    toError(): Error;
    /**
     * Attempts to parse the given string as an integer
     */
    toInt(): number;
}

String.prototype.toError = function (): Error {
    return new Error(this as string)
}

String.prototype.toInt = function (radix?: number | undefined): number {
    return parseInt(this as string, radix)
}
