export interface ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean
}
