import { TServiceInstance, TServiceRegistry, EnumServiceStatus, TServiceQuery } from "@core/types";
import { v4 as uuidv4 } from "uuid";
import { } from '../types/registry';

export class RegistryService {
    private services: Map<string, TServiceInstance> = new Map();
    private readonly CLEANUP_INTERVAL = 60000;
    private readonly HEARTBEAT_TIMEOUT = 30000;

    constructor() {
        setInterval(() => { this.cleanupStaleServices() }, this.CLEANUP_INTERVAL)
    }

    register(registry: TServiceRegistry): TServiceInstance {
        const serviceId = uuidv4();
        const now = new Date();

        const service: TServiceInstance = {
            id: serviceId,
            name: registry.name,
            host: registry.host,
            port: registry.port,
            healthCheckUrl: registry.healthCheckUrl,
            lastHeartbeat: now,
            status: EnumServiceStatus.HEALTHY,
            registeredAt: now
        }

        this.services.set(serviceId, service);
        console.log(`Service ${service.name} registered with ID: ${serviceId}`);

        return service;
    }

    updateHeartbeat(serviceId: string): boolean {
        const service = this.services.get(serviceId)
        if (service) {
            service.lastHeartbeat = new Date();
            service.status = EnumServiceStatus.HEALTHY;
            console.log(`Heartbeat updated for service ${service.name} (${service.id})`);
            return true;
        }
        return false;
    }

    unregister(serviceId: string): boolean {
        const deleted = this.services.delete(serviceId)
        if (deleted) {
            console.log(`Service with ID ${serviceId} unregistered successfully.`);
        }
        return deleted
    }

    getService(serviceId: string): TServiceInstance | undefined {
        return this.services.get(serviceId);
    }

    getServicesByName(name: string): TServiceInstance[] {
        return Array.from(this.services.values()).filter(service => service.name === name);
    }

    getHealthyServicesByName(name: string): TServiceInstance[] {
        return this.getServicesByName(name).filter(service => service.status === EnumServiceStatus.HEALTHY)
    }

    getServices(query?: TServiceQuery): TServiceInstance[] {
        let services = Array.from(this.services.values())

        if (query?.name) {
            services = services.filter(service => service.name === query.name);
        }

        if (query?.status) {
            services = services.filter(service => service.status === query.status);
        }

        return services;
    }

    cleanupStaleServices() {
        const now = new Date()
        const staleCutoff = new Date(now.getTime() - this.HEARTBEAT_TIMEOUT)

        for (const [serviceId, service] of this.services.entries()) {
            if (service.lastHeartbeat < staleCutoff) {
                service.status = EnumServiceStatus.UNHEALTHY;
                console.warn(`Service ${service.name} (${service.id}) is marked as unhealthy due to stale heartbeat.`);
                console.warn(`Last heartbeat was at ${service.lastHeartbeat.toISOString()}`);
                console.warn(`staleCutoff was at ${staleCutoff.toISOString()}`);

                const removeCutoff = new Date(now.getTime() - (this.HEARTBEAT_TIMEOUT * 2));
                if (service.lastHeartbeat < removeCutoff) {
                    this.services.delete(serviceId);
                    console.warn(`Service ${service.name} (${service.id}) has been removed due to prolonged unhealthiness.`);
                }
            }
        }
    }

    getStatus() {
        const services = Array.from(this.services.values())

        return {
            totalServices: services.length,
            healthyServices: services.filter(service => service.status === EnumServiceStatus.HEALTHY).length,
            unhealthyServices: services.filter(service => service.status === EnumServiceStatus.UNHEALTHY).length,
            unknownServices: services.filter(service => service.status === EnumServiceStatus.UNKNOWN).length,
            servicesByName: services.reduce((acc, service) => {
                acc[service.name] = (acc[service.name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        }
    }

    heartbeat(serviceId: string): boolean {
        const service = this.services.get(serviceId);
        if (service) {
            service.lastHeartbeat = new Date();
            service.status = EnumServiceStatus.HEALTHY;
            console.log(`Heartbeat received for service ${service.name} (${service.id})`);
            return true;
        }

        return false
    }

    getStats() {
        const services = Array.from(this.services.values());
        return {
            total: services.length,
            healthy: services.filter(service => service.status === EnumServiceStatus.HEALTHY).length,
            unhealthy: services.filter(service => service.status === EnumServiceStatus.UNHEALTHY).length,
            unknown: services.filter(service => service.status === EnumServiceStatus.UNKNOWN).length,
            servicesByName: services.reduce((acc, service) => {
                acc[service.name] = (acc[service.name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        }
    }
}