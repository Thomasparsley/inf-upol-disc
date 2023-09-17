/**
 * Helper function that checks whether a given string is a valid email address
 * @param email String which will be checked as to whether it is valid
 * @returns True, if the given string is a valid email address, else false
 */
export function isValidateEmail(email: string): boolean {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null
}
