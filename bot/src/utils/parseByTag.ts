import { JSDOM } from "jsdom";

export function parseByTag(data: string, tagName: string): string[] {
    const { document } = new JSDOM(`<!DOCTYPE html>${data}`).window;

    const tagCollection = document.getElementsByTagName(tagName);
    const elements = Array.from(tagCollection);

    return elements.map(el => (el.textContent !== null) ? el.textContent : "");
}
