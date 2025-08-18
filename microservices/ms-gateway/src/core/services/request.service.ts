export function HttpRequest(url: string, method: "POST" | "GET" | "DELETE" | "PUT", body: Record<string, any>, messageError: string) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(response => {
        if (!response.ok) {
            console.log(response)
            throw new Error(messageError);
        }
        return response.json()
    });
}