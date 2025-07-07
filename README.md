# Uso de TurboRepo

Este proyecto utiliza **Turborepo** y **npm workspaces** para gestionar un monorepo de microservicios. Turborepo optimiza la construcción, testing y ejecución de múltiples aplicaciones de forma eficiente.

## 🏗️ Arquitectura del Proyecto

```
microservicios_group16/
├── apps/
│   ├── authentication/    # Servicio de autenticación
│   ├── product/          # Servicio de productos
│   ├── report/           # Servicio de reportes
│   └── task/             # Servicio de tareas
├── package.json          # Configuración del workspace raíz
├── turbo.json           # Configuración de Turborepo
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 22.12.0
- npm >= 11.4.2

### Instalación
```bash
# Clonar el repositorio y cambiar a la rama feat/monorepo
git clone https://github.com/cursosdevfull/Microservicios_Group16.git
cd Microservicios_Group16
git checkout feat/monorepo

# Instalar dependencias para todos los workspaces
npm install
```

### Ejecutar todos los microservicios
```bash
# Ejecutar todos los servicios simultáneamente
npm start

# O usando turbo directamente
npx turbo run start
```

## 📦 Gestión de Workspaces

### ¿Qué son los Workspaces?
Los workspaces de npm permiten gestionar múltiples paquetes en un solo repositorio, compartiendo dependencias y facilitando el desarrollo.

### Estructura de Workspaces
Cada microservicio está definido en `apps/*` como un workspace independiente:

```json
// package.json (raíz)
{
  "workspaces": [
    "apps/*"
  ]
}
```

### Comandos útiles para Workspaces

```bash
# Instalar dependencias en un workspace específico
npm install express --workspace=authentication

# Ejecutar un comando en un workspace específico
npm run start --workspace=authentication

# Ejecutar un comando en todos los workspaces
npm run start --workspaces

# Listar todos los workspaces
npm ls --workspaces
```

## ⚡ Turborepo

### ¿Qué es Turborepo?
Turborepo es una herramienta de build system que optimiza la ejecución de tareas en monorepos mediante:
- **Ejecución paralela**: Ejecuta tareas simultáneamente cuando es posible
- **Caché inteligente**: Evita re-ejecutar tareas que no han cambiado
- **Gestión de dependencias**: Respeta el orden de ejecución entre paquetes

### Configuración de Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "start": {
      "dependsOn": ["^start"]
    },
    "//#format-and-lint": {}
  }
}
```

### Comandos de Turborepo

```bash
# Ejecutar la tarea 'start' en todos los workspaces
turbo run start

# Ejecutar múltiples tareas
turbo run start format-and-lint

# Ejecutar con paralelismo máximo
turbo run start --parallel

# Ver el grafo de dependencias
turbo run start --graph

# Limpiar caché
turbo run start --force

# Ejecutar solo en workspaces que han cambiado
turbo run start --filter=...[HEAD^]
```

## 🔧 Scripts Disponibles

### Scripts del workspace raíz
```bash
# Formatear y lintear código en todos los workspaces
npm run format-and-lint

# Ejecutar todos los microservicios
npm start

# Ejecutar biome en todos los workspaces
npm run biome
```

### Scripts por microservicio
Cada microservicio tiene sus propios scripts definidos en su `package.json`:

```bash
# Ejecutar un microservicio específico
npm run start --workspace=authentication
npm run start --workspace=product
npm run start --workspace=report
npm run start --workspace=task
```

## 🔍 Microservicios Disponibles

### Authentication Service
- **Puerto**: Configurado en `apps/authentication/index.js`
- **Propósito**: Gestión de autenticación y JWT
- **Dependencias**: jsonwebtoken

### Product Service
- **Puerto**: Configurado en `apps/product/index.js`
- **Propósito**: Gestión de productos

### Report Service
- **Puerto**: Configurado en `apps/report/index.js`
- **Propósito**: Generación de reportes

### Task Service
- **Puerto**: Configurado en `apps/task/index.js`
- **Propósito**: Gestión de tareas

## 🛠️ Desarrollo

### Agregar un nuevo microservicio

1. Crear directorio en `apps/`:
```bash
mkdir apps/nuevo-servicio
```

2. Crear `package.json`:
```json
{
  "name": "nuevo-servicio",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  }
}
```

3. Crear `index.js` con la lógica del servicio

4. Instalar dependencias desde la raíz:
```bash
npm install
```

### Gestionar dependencias

```bash
# Dependencia compartida (raíz)
npm install lodash

# Dependencia específica de un servicio
npm install express --workspace=authentication

# Dependencia de desarrollo global
npm install --save-dev jest
```

## 📋 Buenas Prácticas

1. **Versionado**: Mantén versiones consistentes entre workspaces
2. **Dependencias**: Usa dependencias compartidas cuando sea posible
3. **Scripts**: Define scripts consistentes en todos los workspaces
4. **Caché**: Aprovecha el caché de Turborepo para builds más rápidos
5. **Testing**: Ejecuta tests en paralelo con Turborepo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.