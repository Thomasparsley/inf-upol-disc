export function isUpolEmail(email: string): boolean {
    return email
        .toLowerCase()
        .match(/^[a-z]*\.[a-z]*[0-9]{2}\@upol\.cz$/)!== null
}