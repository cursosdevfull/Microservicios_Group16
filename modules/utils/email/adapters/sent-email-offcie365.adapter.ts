/** biome-ignore-all lint/correctness/noUnusedVariables: empty */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: empty */
import type { ISentEmail } from "../ports/sent-email.interface"

export class SentEmailByOffice365 implements ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const bodySanatize = this.sanatize(body)
        console.log("Email sent by Office365")
        return true
    }

    private getProtocol() {
        return "imap"
    }

    private sanatize(body: string) {
        return body.replace(/"/, "'")
    }
}