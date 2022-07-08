interface String {
    toError(): Error;
}

String.prototype.toError = function() {
    return new Error(this as string);
}
