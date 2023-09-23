/**
 * Helper function that checks whether the given email address is a valid UPOL email
 * @param email The email address which should be checked
 * @returns True, if the given email address is a valid UPOL email address, else false
 */
export function isUpolEmail(email: string): boolean {
    return email
        .toLowerCase()
        .match(/^[a-z]*\.[a-z]*[0-9]{2}\@upol\.cz$/)!== null
}