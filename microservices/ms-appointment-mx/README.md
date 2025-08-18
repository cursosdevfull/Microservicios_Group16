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
- **Arquitectura**: Estructura modular preparada para microservicios

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
docker run -p 3000:3000 --network network-mysql microservicios-group16
```

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

## 📁 Estructura del Proyecto

```
src/
├── app.ts                 # Configuración principal de Express
├── index.ts              # Punto de entrada de la aplicación
├── env.ts                # Configuración de variables de entorno
├── core/
│   ├── bootstrap/        # Inicialización de servicios
│   │   ├── database.bootstrap.ts
│   │   ├── kafka.bootstrap.ts
│   │   ├── rabbitmq.bootstrap.ts
│   │   ├── redis.bootstrap.ts
│   │   └── server.bootstrap.ts
│   ├── middleware/       # Middlewares de Express
│   │   └── error.middleware.ts
│   └── services/         # Servicios de infraestructura
│       └── healthcheck.service.ts
└── modules/              # Módulos de negocio (agregar aquí tus microservicios)
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta la aplicación compilada

## 🛡️ Middleware

- **Error Handling**: Manejo centralizado de errores
- **JSON Parser**: Procesamiento de requests JSON
- **URL Encoded**: Soporte para datos de formularios

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