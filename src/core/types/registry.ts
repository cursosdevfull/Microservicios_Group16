export enum EnumServiceStatus {
    HEALTHY = "healthy",
    UNHEALTHY = "unhealthy",
    UNKNOWN = "unknown"
}

export type TServiceInstance = {
    id: string
    name: string
    host: string
    port: number
    healthCheckUrl: string
    lastHeartbeat: Date
    status: EnumServiceStatus
    registeredAt: Date
}

export type TServiceRegistry = Omit<TServiceInstance, "lastHeartbeat" | "status" | "registeredAt" | "id">

export type TServiceQuery = {
    name?: string
    status?: EnumServiceStatus
}