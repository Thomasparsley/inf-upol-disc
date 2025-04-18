/**
 * Interface representing an email message
 */
export interface Message {
    /**
     * To who this message is addressed
     */
    to: string
    /**
     * Subject of the message
     */
    subject: string
    /**
     * Text of the message
     */
    text?: string
    /**
     * HTML content of the message
     */
    html?: string
}
