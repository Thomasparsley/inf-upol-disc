import { isHttpUrl } from "./isHttp";

export function isHttpUrlWithFileExt(string: string, exts: string[]): boolean {
    if(!isHttpUrl(string))
        return false;

    for (const ext of exts)
        if (!string.endsWith(`.${ext}`))
            return false;

    return true;
}