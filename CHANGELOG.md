# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 17/06/2025

### Añadido
- **Nuevos módulos de gestión:**
  - Módulo de tipos de drones (`drone-types`) con CRUD completo
  - Módulo de marcas de drones (`drone-brands`) con CRUD completo
  - Filtrado de tipos de drones por categoría
  - Filtrado de marcas de drones por país

- **Middleware de normalización de email:**
  - Nuevo middleware que normaliza automáticamente los emails en las peticiones
  - Convierte emails a minúsculas y elimina espacios en blanco
  - Se aplica automáticamente a todas las rutas

- **Nuevos endpoints API:**
  - `GET /drone-types` - Obtener todos los tipos de drones
  - `GET /drone-types/:id` - Obtener tipo de drone por ID
  - `POST /drone-types` - Crear nuevo tipo de drone
  - `PUT /drone-types/:id` - Actualizar tipo de drone
  - `DELETE /drone-types/:id` - Eliminar tipo de drone
  - `GET /drone-types/category/:category` - Filtrar por categoría
  - `GET /drone-brands` - Obtener todas las marcas de drones
  - `GET /drone-brands/:id` - Obtener marca de drone por ID
  - `POST /drone-brands` - Crear nueva marca de drone
  - `PUT /drone-brands/:id` - Actualizar marca de drone
  - `DELETE /drone-brands/:id` - Eliminar marca de drone
  - `GET /drone-brands/country/:country` - Filtrar por país

### Mejorado
- **Seguridad y validación:**
  - Validación de autorización en rutas de usuarios
  - Los usuarios solo pueden acceder a sus propios drones y vuelos
  - Verificación de que el ID en la ruta coincida con el usuario autenticado

- **Logging y mensajes:**
  - Traducción de todos los mensajes de error de español a inglés
  - Traducción de todos los logs de base de datos a inglés

- **Documentación:**
  - README actualizado con todos los nuevos endpoints
  - Documentación de categorías disponibles para tipos de drones
  - Documentación de filtrado por país para marcas de drones
  - Reorganización de endpoints por dependencias

- **Colección Postman:**
  - Nueva colección Postman v1.3 con todos los endpoints
  - Variables automáticas para tokens de autenticación
  - Tests automatizados para validación de respuestas
  - Organización mejorada por módulos
  - Flujo de testing recomendado

### Cambiado
- **Estructura de rutas:**
  - Rutas de drones y vuelos por usuario ahora requieren validación de ID
  - `GET /users/:userId/drones` - Validación de autorización
  - `GET /users/:userId/flights` - Validación de autorización

- **Formato de logs:**
  - Cambio de formato de timestamp en Winston logger
  - Nuevo formato personalizado con fecha y hora

### Técnico
- **Nuevos archivos añadidos:**
  - `src/modules/drone-types/` - Módulo completo de tipos de drones
  - `src/modules/drone-brands/` - Módulo completo de marcas de drones
  - `src/middlewares/email-normalize.middleware.ts` - Middleware de normalización
  - `postman/api-v1.3.json` - Nueva colección Postman

- **Archivos modificados:**
  - `src/app.ts` - Integración de nuevos módulos y middleware
  - `src/utils/logger.ts` - Nuevo formato de timestamp
  - `src/configs/database.ts` - Logs traducidos a inglés
  - `src/modules/*/` - Mensajes de error traducidos
  - `README.md` - Documentación actualizada

---

## [1.2.0] - Versión anterior
### Funcionalidades base
- Sistema de autenticación JWT
- Gestión de usuarios
- Gestión de drones
- Gestión de vuelos
- Logging con Winston
- Base de datos MongoDB
- Cache con Redis