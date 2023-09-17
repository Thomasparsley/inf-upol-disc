/**
 * Helper function that checks whether the given string is a valid HTTP(S) URL
 * @param string String, that should be checked
 * @returns True, if the string is a valid HTTP(S) URL, else false
 */
export function isHttpUrl(string: string): boolean {
    let url
    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    return url.protocol === "http:" || url.protocol === "https:"
}
