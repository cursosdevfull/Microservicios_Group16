import { DatabaseBootstrap } from '../bootstrap/database.bootstrap';
import { RedisBootstrap } from '../bootstrap/redis.bootstrap';
import { RabbitMQBootstrap } from '../bootstrap/rabbitmq.bootstrap';
import { KafkaBootstrap } from '../bootstrap/kafka.bootstrap';

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

    async checkRedis(): Promise<HealthCheckStatus> {
        try {
            const RedisBootstrapAny = RedisBootstrap as any;
            if (!RedisBootstrapAny.client) {
                return {
                    service: 'redis',
                    status: 'unhealthy',
                    message: 'Redis client not initialized',
                    timestamp: new Date().toISOString()
                };
            }

            // Test Redis connection with ping
            const result = await RedisBootstrapAny.client.ping();
            if (result === 'PONG') {
                return {
                    service: 'redis',
                    status: 'healthy',
                    message: 'Redis connection is working',
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    service: 'redis',
                    status: 'unhealthy',
                    message: 'Redis ping failed',
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error: any) {
            return {
                service: 'redis',
                status: 'unhealthy',
                message: `Redis error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkRabbitMQ(): Promise<HealthCheckStatus> {
        try {
            if (!RabbitMQBootstrap.channel) {
                return {
                    service: 'rabbitmq',
                    status: 'unhealthy',
                    message: 'RabbitMQ channel not initialized',
                    timestamp: new Date().toISOString()
                };
            }

            // Test RabbitMQ connection by checking if the channel is open
            const connection = RabbitMQBootstrap.channel.connection;
            if (!connection || (connection as any).readable === false) {
                return {
                    service: 'rabbitmq',
                    status: 'unhealthy',
                    message: 'RabbitMQ connection is not readable',
                    timestamp: new Date().toISOString()
                };
            }

            return {
                service: 'rabbitmq',
                status: 'healthy',
                message: 'RabbitMQ connection is working',
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            return {
                service: 'rabbitmq',
                status: 'unhealthy',
                message: `RabbitMQ error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkKafka(): Promise<HealthCheckStatus> {
        try {
            const kafka = KafkaBootstrap.getKafkaInstance();
            if (!kafka) {
                return {
                    service: 'kafka',
                    status: 'unhealthy',
                    message: 'Kafka instance not initialized',
                    timestamp: new Date().toISOString()
                };
            }

            // Test Kafka connection by creating an admin client and listing metadata
            const admin = kafka.admin();
            await admin.connect();
            await admin.fetchTopicMetadata();
            await admin.disconnect();

            return {
                service: 'kafka',
                status: 'healthy',
                message: 'Kafka connection is working',
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            return {
                service: 'kafka',
                status: 'unhealthy',
                message: `Kafka error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkAllServices(): Promise<HealthCheckResult> {
        const checks = await Promise.allSettled([
            this.checkDatabase(),
            this.checkRedis(),
            this.checkRabbitMQ(),
            this.checkKafka()
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
