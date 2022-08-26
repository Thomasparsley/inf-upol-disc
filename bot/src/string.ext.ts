interface String {
    toError(): Error;
    toInt(): number;
}

String.prototype.toError = function (): Error {
    return new Error(this as string)
}

String.prototype.toInt = function (radix?: number | undefined): number {
    return parseInt(this as string, radix)
}
