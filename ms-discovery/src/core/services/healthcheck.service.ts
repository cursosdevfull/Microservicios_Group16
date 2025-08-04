export interface HealthCheckResult {
    overall: 'healthy' | 'unhealthy';
    timestamp: string;
}

export class HealthCheckService {


    async checkAllServices(): Promise<HealthCheckResult> {

        const overall = 'healthy';

        return {
            overall,
            timestamp: new Date().toISOString()
        };
    }
}
