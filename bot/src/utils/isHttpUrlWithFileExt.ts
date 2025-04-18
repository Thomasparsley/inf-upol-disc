import { isHttpUrl } from "./isHttp"

/**
 * Helper function that checks whether the given string is a valid HTTP(S) URL with the given file extension
 * @param string String, that should be checked
 * @param exts List of allowed extensions the link can have
 * @returns True, if the given string is a valid HTTP(S) URL with an allowed file extension, else false
 */
export function isHttpUrlWithFileExt(string: string, exts: string[]): boolean {
    if (!isHttpUrl(string))
        return false

    for (const ext of exts)
        if (!string.endsWith(`.${ext}`))
            return false

    return true
}