# Ejemplo arquitectura hexagonal

Este proyecto es un ejemplo práctico de **Arquitectura Hexagonal** (también conocida como Ports and Adapters) implementado en TypeScript. La arquitectura hexagonal permite crear aplicaciones altamente desacopladas, testeable y mantenible mediante la separación clara entre la lógica de negocio y los detalles de implementación.

## 🏗️ Arquitectura Hexagonal

La arquitectura hexagonal separa la aplicación en tres capas principales:

### 1. **Dominio (Core)**
- Contiene la lógica de negocio pura
- No depende de frameworks, bases de datos o servicios externos
- Define los contratos (ports) que debe cumplir la infraestructura

### 2. **Puertos (Ports)**
- Interfaces que definen los contratos
- Abstrae las dependencias externas
- Permite la inversión de dependencias

### 3. **Adaptadores (Adapters)**
- Implementaciones concretas de los puertos
- Se conectan con servicios externos
- Pueden ser intercambiados sin afectar el dominio

## 📁 Estructura del Proyecto

```
microservicios_group16/
├── modules/
│   └── utils/
│       └── email/
│           ├── ports/
│           │   └── sent-email.interface.ts    # Puerto (interfaz)
│           ├── adapters/
│           │   ├── sent-email-gmail.adapter.ts      # Adaptador Gmail
│           │   └── sent-email-offcie365.adapter.ts  # Adaptador Office365
│           └── sent-email.ts                   # Servicio del dominio
├── index.ts                                   # Punto de entrada
├── ports-and-adapters.ts                     # Ejemplo completo en un archivo
├── tsconfig.json                             # Configuración TypeScript
└── README.md
```

## 🚀 Ejemplo: Sistema de Envío de Emails

El proyecto implementa un sistema de envío de emails que puede usar diferentes proveedores (Gmail, Office365) sin cambiar la lógica de negocio.

### Puerto (Interfaz)
```typescript
// modules/utils/email/ports/sent-email.interface.ts
export interface ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean
}
```

### Adaptadores (Implementaciones)

#### Adaptador Gmail
```typescript
// modules/utils/email/adapters/sent-email-gmail.adapter.ts
export class SentEmailByGMail implements ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const domain = this.getDomain()
        console.log("Email sent by GMail")
        return true
    }

    private getDomain() {
        return "smtp.mydomain.com"
    }
}
```

#### Adaptador Office365
```typescript
// modules/utils/email/adapters/sent-email-offcie365.adapter.ts
export class SentEmailByOffice365 implements ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const bodySanatize = this.sanatize(body)
        console.log("Email sent by Office365")
        return true
    }

    private sanatize(body: string) {
        return body.replace(/"/, "'")
    }
}
```

### Servicio del Dominio
```typescript
// modules/utils/email/sent-email.ts
export class SentEmail {
    constructor(private readonly service: ISentEmail) { }

    sent(sender: string, subject: string, body: string, isHtml: boolean, receiver: string) {
        this.service.send(sender, subject, body, isHtml, receiver)
    }
}
```

## 🎯 Uso del Sistema

### Ejemplo de Implementación
```typescript
// index.ts
import { SentEmailByOffice365 } from "./modules/utils/email/adapters/sent-email-offcie365.adapter";
import type { ISentEmail } from "./modules/utils/email/ports/sent-email.interface";
import { SentEmail } from "./modules/utils/email/sent-email";

// Inyección de dependencias - se puede cambiar fácilmente
const service: ISentEmail = new SentEmailByOffice365()
const sentEmail = new SentEmail(service)
sentEmail.sent("sergio@correo.com", "Bienvenido", "Bienvenido a nuestra comunidad", true, "new@email.com")
```

### Intercambio de Adaptadores
```typescript
// Cambiar de Office365 a Gmail sin modificar lógica de negocio
const gmailService: ISentEmail = new SentEmailByGMail()
const sentEmailWithGmail = new SentEmail(gmailService)
```

## 🔧 Ejecutar el Proyecto

### Prerrequisitos
- Node.js >= 18.0.0
- TypeScript instalado globalmente o localmente

### Instalación y Ejecución
```bash
# Clonar el repositorio y cambiar a la rama feat/monorepo
git clone https://github.com/cursosdevfull/Microservicios_Group16.git
cd Microservicios_Group16
git checkout feat/monorepo

# Ejecutar el ejemplo
npx tsx index.ts

# O compilar y ejecutar
npx tsc
node index.js
```

## ✅ Beneficios de la Arquitectura Hexagonal

### 1. **Inversión de Dependencias**
- El dominio no depende de la infraestructura
- Las dependencias apuntan hacia adentro (hacia el dominio)

### 2. **Testabilidad**
- Fácil crear mocks de los puertos
- Tests unitarios aislados del mundo exterior

### 3. **Flexibilidad**
- Cambiar proveedores sin afectar la lógica de negocio
- Agregar nuevos adaptadores fácilmente

### 4. **Mantenibilidad**
- Separación clara de responsabilidades
- Código más limpio y organizado

## 🧪 Ejemplo de Testing

```typescript
// Ejemplo de test unitario
class MockEmailService implements ISentEmail {
    public sentEmails: Array<{sender: string, subject: string}> = []
    
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        this.sentEmails.push({sender, subject})
        return true
    }
}

// Test
const mockService = new MockEmailService()
const sentEmail = new SentEmail(mockService)
sentEmail.sent("test@test.com", "Test Subject", "Body", false, "receiver@test.com")

console.log(mockService.sentEmails.length === 1) // true
```

## 🔄 Extensibilidad

### Agregar un Nuevo Proveedor
1. Crear un nuevo adaptador que implemente `ISentEmail`
2. Implementar la lógica específica del proveedor
3. Inyectar el nuevo adaptador sin modificar código existente

```typescript
// Ejemplo: Nuevo adaptador para SendGrid
export class SentEmailBySendGrid implements ISentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        // Lógica específica de SendGrid
        console.log("Email sent by SendGrid")
        return true
    }
}
```

## 🎨 Conceptos Clave

- **Puerto**: Interfaz que define un contrato (`ISentEmail`)
- **Adaptador**: Implementación concreta del puerto (`SentEmailByGMail`, `SentEmailByOffice365`)
- **Dominio**: Lógica de negocio pura (`SentEmail`)
- **Inyección de Dependencias**: El dominio recibe sus dependencias desde el exterior

## 📚 Recursos Adicionales

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Ports and Adapters Pattern](https://jmgarridopaz.github.io/content/hexagonalarchitecture.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.