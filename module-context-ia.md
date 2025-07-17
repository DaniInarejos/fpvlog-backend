# Contexto del Módulo

## Estructura Base del Módulo
Un módulo típico en este proyecto sigue esta estructura:
```bash
/nombre-modulo/
├── aggregations/        # Agregaciones de MongoDB (opcional)
├── nombre-modulo.models.ts      # Definición del modelo y schema
├── nombre-modulo.controllers.ts # Controladores para las rutas
├── nombre-modulo.repository.ts  # Operaciones directas con la base de datos
├── nombre-modulo.routes.ts      # Definición de rutas
└── nombre-modulo.services.ts    # Lógica de negocio
```

## Componentes Principales

### 1. Modelo (models.ts)
- Define la interfaz principal que extiende `Document` de Mongoose
- Define el schema con sus campos y validaciones
- Incluye hooks pre/post si son necesarios
- Incluye métodos del modelo si son necesarios
- Ejemplo estructura:
```typescript
import { Schema, model, Document, Types } from 'mongoose'

export interface IModelo extends Document {
  // Campos requeridos
  campo1: string
  campo2: number
  // Campos opcionales
  campo3?: string
  // Referencias a otros modelos
  referencia: Types.ObjectId
  // Campos con tipos específicos
  configuracion: {
    opcion1: boolean
    opcion2: string
  }
  // Métodos personalizados
  metodoPersonalizado(): Promise<any>
}

const modeloSchema = new Schema<IModelo>({/* definición del schema */})

// Hooks si son necesarios
modeloSchema.pre('save', async function(next) {/* lógica */})

// Métodos del modelo
modeloSchema.methods.metodoPersonalizado = async function() {/* lógica */}

export default model<IModelo>('Modelo', modeloSchema)
```

### 2. Repositorio (repository.ts)
- Contiene operaciones directas con la base de datos
- Implementa caché si es necesario
- Maneja validaciones de ObjectId
- Estructura típica:
```typescript
import { Types } from 'mongoose'
import ModeloModel, { IModelo } from './modelo.models'
import { cacheService } from '../../configs/cache'

export async function getAllRepository(): Promise<IModelo[]> {
  const cacheKey = 'modelo:all'
  return await cacheService.loadData<IModelo[]>(
    cacheKey,
    async () => await ModeloModel.find().select('-__v')
  )
}

export async function getByIdRepository(id: string): Promise<IModelo | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID inválido')
  }
  return await ModeloModel.findById(id)
}
```

### 3. Servicios (services.ts)
- Contiene la lógica de negocio
- Maneja validaciones de datos
- Coordina operaciones complejas
- Estructura típica:
```typescript
import { IModelo } from './modelo.models'
import * as repository from './modelo.repository'

export async function getAllService(): Promise<IModelo[]> {
  return await repository.getAllRepository()
}

export async function createService(data: unknown): Promise<IModelo> {
  // Validación de datos
  // Lógica de negocio
  // Llamada al repositorio
}
```

### 4. Controladores (controllers.ts)
- Maneja las peticiones HTTP
- Gestiona errores
- Formatea respuestas
- Estructura típica:
```typescript
import { Context } from 'hono'
import * as service from './modelo.services'
import { getErrorMessage } from '../../utils/error'

export async function getAllController(context: Context): Promise<Response> {
  try {
    const resultado = await service.getAllService()
    return context.json(resultado)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}
```

### 5. Agregaciones (aggregations/)
- Contiene pipelines de MongoDB complejos
- Organiza lookups y proyecciones
- Estructura típica:
```typescript
import { PipelineStage } from 'mongoose'

const lookupRelacionado = {
  $lookup: {
    from: 'coleccion',
    localField: 'campo',
    foreignField: '_id',
    as: 'relacionado'
  }
}

export const agregacionCompleja = (parametro: string): PipelineStage[] => [
  { $match: { campo: parametro } },
  lookupRelacionado,
  { $project: { /* campos */ } }
]
```

## Consideraciones de Seguridad
1. Validar ObjectIds antes de consultas
2. Implementar middleware de autenticación cuando sea necesario
3. Validar permisos de usuario en operaciones sensibles
4. Sanitizar datos de entrada
5. Manejar errores apropiadamente

## Integración con OpenAPI
- Definir documentación OpenAPI en `/src/openapi/modules/`
- Incluir schemas, paths y ejemplos
- Documentar respuestas de error

## Buenas Prácticas
1. Usar tipos TypeScript estrictos
2. Implementar caché cuando sea beneficioso
3. Seguir principios SOLID
4. Mantener controladores ligeros
5. Centralizar lógica de negocio en servicios
6. Usar constantes para valores repetidos
7. Documentar funciones complejas