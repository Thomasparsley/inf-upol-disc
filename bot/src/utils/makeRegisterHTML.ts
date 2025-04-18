import { readFileSync } from "fs";

import { compile } from "handlebars";

const content = readFileSync("../templates/verification-email.html");
const template = compile(content.toString());


/**
 * Helper function, which generates HTML for the given verification code using a template
 * @param code String array representing the code
 * @returns Generated HTML for the specified verification code
 */
export function makeRegisterHTML(code: string[]) {
    return template({ code: code });
}
