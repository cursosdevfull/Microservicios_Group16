import { env } from '../../env';
import { ServiceInfo } from '../interfaces/service-info';

export class DiscoveryClient {
    private readonly discoveryUrl = env.DISCOVERY_URL;
    private readonly port = env.PORT;
    private readonly host = env.HOST;
    private readonly name = env.NAME;

    constructor() { }

    async register() {
        const serviceInfo = {
            name: this.name,
            host: this.host,
            port: this.port,
            healthCheckUrl: `http://${this.host}:${this.port}/health`
        };

        try {
            const response = await fetch(`${this.discoveryUrl}/api/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceInfo)
            });

            if (!response.ok) {
                throw new Error(`Failed to register service: ${response.statusText}`);
            }

            const data = await response.json() as { id: string };
            console.log('Service registered successfully:', data);

            this.startHeartbeat(data.id);
        } catch (error) {
            console.error('Error registering service:', error);
        }
    }

    async findService(name: string): Promise<Array<ServiceInfo> | null> {
        const url = `${this.discoveryUrl}/api/services/name/${name}`;
        console.log(`Finding service at: ${url}`);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to find service: ${response.statusText}`);
            }
            return await response.json()
        } catch (error) {
            console.error('Error finding service:', error);
            throw error;
        }
    }

    private startHeartbeat(id: string) {
        setInterval(async () => {
            try {
                const response = await fetch(`${this.discoveryUrl}/api/services/${id}/heartbeat`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to send heartbeat: ${response.statusText}`);
                }

                console.log(`Heartbeat sent for service ID: ${id}`);
            } catch (error) {
                console.error('Error sending heartbeat:', error);
            }
        }, 15000);
    }
}