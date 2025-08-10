import { DatabaseBootstrap } from '../bootstrap/database.bootstrap';

export interface HealthCheckStatus {
    service: string;
    status: 'healthy' | 'unhealthy';
    message?: string;
    timestamp: string;
}

export interface HealthCheckResult {
    overall: 'healthy' | 'unhealthy';
    services: HealthCheckStatus[];
    timestamp: string;
}

export class HealthCheckService {

    async checkDatabase(): Promise<HealthCheckStatus> {
        try {
            if (!DatabaseBootstrap.dataSource) {
                return {
                    service: 'database',
                    status: 'unhealthy',
                    message: 'Database connection not initialized',
                    timestamp: new Date().toISOString()
                };
            }

            if (!DatabaseBootstrap.dataSource.isInitialized) {
                return {
                    service: 'database',
                    status: 'unhealthy',
                    message: 'Database connection not established',
                    timestamp: new Date().toISOString()
                };
            }

            // Test connection with a simple query
            await DatabaseBootstrap.dataSource.query('SELECT 1');

            return {
                service: 'database',
                status: 'healthy',
                message: 'Database connection is working',
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            return {
                service: 'database',
                status: 'unhealthy',
                message: `Database error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkAllServices(): Promise<HealthCheckResult> {
        const checks = await Promise.allSettled([
            this.checkDatabase(),
        ]);

        const services: HealthCheckStatus[] = checks.map((check, index) => {
            if (check.status === 'fulfilled') {
                return check.value;
            } else {
                const serviceNames = ['database', 'redis', 'rabbitmq', 'kafka'];
                return {
                    service: serviceNames[index],
                    status: 'unhealthy',
                    message: `Health check failed: ${check.reason}`,
                    timestamp: new Date().toISOString()
                };
            }
        });

        const overall = services.every(service => service.status === 'healthy') ? 'healthy' : 'unhealthy';

        return {
            overall,
            services,
            timestamp: new Date().toISOString()
        };
    }
}
