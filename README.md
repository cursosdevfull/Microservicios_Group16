# Microservicios Template - Group 16

Un template completo para microservicios desarrollado con Node.js, TypeScript y Express, incluyendo integración con múltiples servicios de infraestructura.

## 🚀 Características

- **Framework**: Express.js con TypeScript
- **Base de Datos**: MySQL 8 con TypeORM
- **Cache**: Redis
- **Message Brokers**: RabbitMQ y Apache Kafka
- **Containerización**: Docker y Docker Compose
- **Health Checks**: Sistema completo de verificación de servicios
- **Hot Reload**: Nodemon para desarrollo
- **Arquitectura**: Hexagonal (Ports & Adapters) preparada para microservicios
- **Módulo de Usuarios**: CRUD completo con encriptación de contraseñas
- **Seguridad**: Middleware de protección de datos personales
- **Validación**: Schemas con Zod para validación de datos

## 📋 Requisitos Previos

- Node.js 22.12.0
- npm 11.4.2
- Docker y Docker Compose

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/cursosdevfull/Microservicios_Group16.git
   cd Microservicios_Group16
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus configuraciones
   ```

## 🐳 Servicios de Infraestructura

### Iniciar todos los servicios
```bash
docker-compose up -d
```

### Servicios incluidos:

- **MySQL Server**: Puerto 3306
  - Usuario: `user`
  - Contraseña: `12345`
  - Base de datos: `db`

- **phpMyAdmin**: Puerto 8080
  - Interfaz web para gestionar MySQL

- **RabbitMQ**: Puerto 5672 (AMQP), 15672 (Management)
  - Usuario: `user`
  - Contraseña: `12345`
  - Management UI: http://localhost:15672

- **Redis**: Puerto 6379

- **Kafka**: Puerto 9092
  - Zookeeper: Puerto 2181

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Con Docker
```bash
docker build -t microservicios-group16 .
docker run -p 3500:3500 microservicios-group16
```

## 👤 API de Usuarios

El sistema incluye un módulo completo de gestión de usuarios implementado con arquitectura hexagonal:

### Endpoints disponibles:

- `POST /user/v1` - Crear un nuevo usuario
- `GET /user/v1/email/:email` - Buscar usuario por email
- `GET /user/v1/refresh-token/:refreshToken` - Buscar usuario por refresh token

### Ejemplo de uso:

```bash
# Crear usuario
curl -X POST http://localhost:3500/user/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com", 
    "password": "securepassword"
  }'

# Buscar por email
curl http://localhost:3500/user/v1/email/john.doe@example.com

# Buscar por refresh token
curl http://localhost:3500/user/v1/refresh-token/8ff68b8d-0dab-4046-a620-53b6ae1715aa
```

### Características de seguridad:

- **Encriptación de contraseñas**: Usando bcryptjs con salt
- **Protección de datos**: Middleware que oculta contraseñas en respuestas
- **Validación**: Schemas con Zod para validar entrada de datos
- **Refresh Tokens**: Sistema de tokens para autenticación

## 📊 Health Checks

El sistema incluye un completo sistema de health checks para monitorear todos los servicios:

### Endpoints disponibles:

- `GET /` - Estado general de la API
- `GET /health` - Verificación completa de todos los servicios
- `GET /health/database` - Estado de MySQL
- `GET /health/redis` - Estado de Redis
- `GET /health/rabbitmq` - Estado de RabbitMQ
- `GET /health/kafka` - Estado de Kafka

📖 Ver [HEALTHCHECK.md](./HEALTHCHECK.md) para documentación detallada.

## 🏗️ Arquitectura Hexagonal

El proyecto implementa **Arquitectura Hexagonal** (también conocida como Ports & Adapters) para lograr una separación clara de responsabilidades y alta testabilidad:

### Componentes:

1. **Domain (Dominio)**: 
   - `user.ts` - Entidades de dominio con lógica de negocio
   
2. **Application (Aplicación)**:
   - `user.application.ts` - Casos de uso y lógica de aplicación
   
3. **Ports (Puertos)**:
   - `user.port.ts` - Interfaces que definen contratos
   
4. **Adapters (Adaptadores)**:
   - **Primary**: `user.controller.ts`, `user.routes.ts` (entrada)
   - **Secondary**: `user.adapter.ts`, `user.entity.ts` (salida)
   
5. **DTOs**: 
   - `user.dto.ts` - Objetos de transferencia de datos

### Beneficios:

- ✅ **Testabilidad**: Fácil testing unitario mediante mocking de ports
- ✅ **Mantenibilidad**: Separación clara de responsabilidades
- ✅ **Flexibilidad**: Intercambio fácil de adaptadores (base de datos, APIs, etc.)
- ✅ **Independencia**: El dominio no depende de frameworks externos

## 📁 Estructura del Proyecto

```
src/
├── app.ts                 # Configuración principal de Express
├── index.ts              # Punto de entrada de la aplicación
├── env.ts                # Configuración de variables de entorno
├── requests.http         # Ejemplos de requests para testing
├── core/
│   ├── bootstrap/        # Inicialización de servicios
│   │   ├── database.bootstrap.ts
│   │   ├── kafka.bootstrap.ts
│   │   ├── rabbitmq.bootstrap.ts
│   │   ├── redis.bootstrap.ts
│   │   └── server.bootstrap.ts
│   ├── middleware/       # Middlewares de Express
│   │   ├── error.middleware.ts
│   │   └── protection-data-personal.middleware.ts
│   └── services/         # Servicios de infraestructura
│       ├── healthcheck.service.ts
│       └── cypher.service.ts
└── modules/              # Módulos de negocio
    └── user/             # Módulo de usuarios (Arquitectura Hexagonal)
        ├── application/  # Lógica de negocio
        │   ├── user.application.ts
        │   └── user.ts
        ├── adapters/     # Adaptadores (Secondary Ports)
        │   ├── user.adapter.ts
        │   ├── dtos/
        │   │   └── user.dto.ts
        │   └── models/
        │       └── user.entity.ts
        ├── ports/        # Puertos (Interfaces)
        │   └── user.port.ts
        └── presentation/ # Controladores y rutas (Primary Adapters)
            ├── user.controller.ts
            └── user.routes.ts
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta la aplicación compilada

## 🛡️ Middleware

- **Error Handling**: Manejo centralizado de errores
- **JSON Parser**: Procesamiento de requests JSON
- **URL Encoded**: Soporte para datos de formularios
- **Protection Data Personal**: Middleware que oculta automáticamente campos sensibles como contraseñas en las respuestas HTTP

## 🌐 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express.js** - Framework web minimalista

### Base de Datos
- **MySQL 8** - Base de datos relacional
- **TypeORM** - ORM para TypeScript y JavaScript

### Message Brokers
- **RabbitMQ** - Message broker AMQP
- **Apache Kafka** - Plataforma de streaming distribuida

### Cache
- **Redis** - Store de estructura de datos en memoria

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores

### Desarrollo
- **Nodemon** - Monitor de cambios para desarrollo
- **Zod** - Validación de esquemas TypeScript

### Seguridad
- **bcryptjs** - Encriptación de contraseñas con salt

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **CursosDevFull** - [GitHub](https://github.com/cursosdevfull)

## 🔗 Enlaces

- [Repositorio](https://github.com/cursosdevfull/Microservicios_Group16)
- [Issues](https://github.com/cursosdevfull/Microservicios_Group16/issues)