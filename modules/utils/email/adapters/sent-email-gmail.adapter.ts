/** biome-ignore-all lint/correctness/noUnusedVariables: empty */
import type { ISentEmail } from "../ports/sent-email.interface"

export class SentEmailByGMail implements ISentEmail {
    // biome-ignore lint/correctness/noUnusedFunctionParameters: This is a placeholder for the method signature
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const domain = this.getDomain()
        console.log("Email sent by GMail")
        return true
    }

    private getDomain() {
        return "smtp.mydomain.com"
    }
}