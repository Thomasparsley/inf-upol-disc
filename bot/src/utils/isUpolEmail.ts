/**
 * Helper function that checks whether the given email address is a valid UPOL email
 * Does not actually validate the given email address - Use {@link isValidateEmail} for that
 * @param email The email address which should be checked
 * @returns True, if the given email address is a valid UPOL email address, else false
 */
export function isUpolEmail(email: string): boolean {
    return email
        .toLowerCase()
        .includes("@upol.cz")
}
