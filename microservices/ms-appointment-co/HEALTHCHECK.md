# Health Check System

Este sistema de health check verifica el estado de todos los servicios de infraestructura utilizados por la aplicación.

## Endpoints Disponibles

### Health Check General
- **GET /** - Estado general de la API con información de endpoints disponibles
- **GET /health** - Verificación completa de todos los servicios
- **GET /healthcheck** - Alias de /health

### Health Check por Servicio
- **GET /health/database** - Verificación específica de la base de datos MySQL
- **GET /health/redis** - Verificación específica de Redis
- **GET /health/rabbitmq** - Verificación específica de RabbitMQ
- **GET /health/kafka** - Verificación específica de Kafka

## Respuestas

### Respuesta Exitosa (200)
```json
{
  "overall": "healthy",
  "services": [
    {
      "service": "database",
      "status": "healthy",
      "message": "Database connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "redis",
      "status": "healthy", 
      "message": "Redis connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "rabbitmq",
      "status": "healthy",
      "message": "RabbitMQ connection is working", 
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "kafka",
      "status": "healthy",
      "message": "Kafka connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-07-20T10:30:00.000Z"
}
```

### Respuesta con Error (503)
```json
{
  "overall": "unhealthy",
  "services": [
    {
      "service": "database",
      "status": "unhealthy",
      "message": "Database error: Connection timeout",
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "redis",
      "status": "healthy",
      "message": "Redis connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "rabbitmq",
      "status": "healthy",
      "message": "RabbitMQ connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    },
    {
      "service": "kafka",
      "status": "healthy",
      "message": "Kafka connection is working",
      "timestamp": "2025-07-20T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-07-20T10:30:00.000Z"
}
```

## Códigos de Estado HTTP

- **200 OK**: Todos los servicios están funcionando correctamente
- **503 Service Unavailable**: Uno o más servicios están fallando
- **404 Not Found**: Endpoint no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Verificaciones por Servicio

### Database (MySQL)
- Verifica que la conexión esté inicializada
- Ejecuta una consulta simple (`SELECT 1`) para confirmar conectividad

### Redis  
- Verifica que el cliente esté inicializado
- Ejecuta un comando `PING` para confirmar conectividad

### RabbitMQ
- Verifica que el canal esté inicializado
- Comprueba que la conexión esté activa y legible

### Kafka
- Verifica que la instancia esté inicializada
- Crea un cliente administrativo y obtiene metadatos de topics

## Uso en Producción

### Con Docker/Kubernetes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health  
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Con Load Balancers
Configurar el endpoint `/health` como health check para determinar si el servicio puede recibir tráfico.

### Monitoreo
Integrar con sistemas de monitoreo como Prometheus, New Relic, o DataDog usando los endpoints de health check.

## Ejemplos de Uso

### Verificar todos los servicios
```bash
curl http://localhost:3000/health
```

### Verificar solo la base de datos
```bash
curl http://localhost:3000/health/database
```

### Verificar con timeout
```bash
curl --max-time 5 http://localhost:3000/health
```
