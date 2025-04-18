import { JSDOM } from "jsdom"

/**
 * Helper function used for getting text content of all given tags in a given document using DOM
 * @param data HTML document, from which data should be extracted
 * @param tagName The tag, from which data shuold extracted
 * @returns List of text content of each tag specified by tagName in the document
 */
export function parseByTag(data: string, tagName: string): string[] {
    const { document } = new JSDOM(`<!DOCTYPE html>${data}`).window

    const tagCollection = document.getElementsByTagName(tagName)
    const elements = Array.from(tagCollection)

    return elements.map(el => (el.textContent !== null) ? el.textContent : "")
}
