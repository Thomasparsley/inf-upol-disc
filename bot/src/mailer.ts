import { createTransport, Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { Message } from "./interfaces"

/**
 * Class that works as an SMTP client
 */
export class Mailer {
    private readonly ctx: Transporter<SMTPTransport.SentMessageInfo>

    /**
     * Creates a new instance of the mailer class
     * @param host SMTP host of this mail client
     * @param port Port of the SMTP host
     * @param from Address from which the mails should be sent
     * @param username Username for the SMTP client
     * @param password Password for the SMTP client
     */
    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly from: string,
        username: string,
        password: string,
    ) {
        this.ctx = createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: {
                user: username,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.ctx.verify((err, _) => {
            if (err)
                throw err
            else
                console.log("Email connected")
        })
    }

    /**
     * Sends the given message
     * @param message The message should be sent
     * @returns Promise representing the action
     */
    async send(message: Message): Promise<SMTPTransport.SentMessageInfo> {
        return await this.ctx.sendMail({
            from: this.from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
        })
    }
}
