export interface HealthCheckStatus {
    service: string;
    status: 'healthy' | 'unhealthy';
    message?: string;
    timestamp: string;
}

export interface HealthCheckResult {
    timestamp: string;
}

export class HealthCheckService {

    async checkAllServices(): Promise<HealthCheckResult> {
        return {
            timestamp: new Date().toISOString()
        };
    }
}
