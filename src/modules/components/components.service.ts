import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import {
  createComponentRepository,
  deleteComponentRepository,
  findAllComponentsRepository,
  findComponentByIdRepository,
  findComponentsByTypeRepository,
  findComponentsByUserRepository,
  searchComponentsRepository,
  updateComponentRepository
} from './components.repository'

export const componentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brand: z.string(),
  type: z.enum(['FRAME', 'MOTOR', 'ESC', 'FC', 'CAMERA', 'VTX', 'ANTENNA', 'RECEIVER', 'BATTERY', 'PROPS', 'MOUNT', 'OTHER']),
  description: z.string().optional(),
  image: z.string().optional(),
  sourceUrl: z.string().optional(),
  weightGrams: z.number().optional(),
  createdBy: z.string().min(1, 'El usuario es requerido')
})

export const getAllComponents = async () => {
  return await findAllComponentsRepository()
}

export const getComponentById = async (id: string) => {
  const component = await findComponentByIdRepository(id)
  
  if (!component) {
    throw new HTTPException(404, { message: 'Componente no encontrado' })
  }
  
  return component
}

export const getComponentsByType = async (type: string) => {
  return await findComponentsByTypeRepository(type)
}

export const getComponentsByUser = async (userId: string) => {
  return await findComponentsByUserRepository(userId)
}

export const createComponent = async (data: unknown) => {
  try {
    const validatedData = componentSchema.parse(data)
    return await createComponentRepository(validatedData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, { message: error.errors[0].message })
    }
    throw error
  }
}

export const updateComponent = async (id: string, data: unknown) => {
  try {
    const validatedData = componentSchema.partial().parse(data)
    const component = await updateComponentRepository(id, validatedData)
    
    if (!component) {
      throw new HTTPException(404, { message: 'Componente no encontrado' })
    }
    
    return component
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, { message: error.errors[0].message })
    }
    throw error
  }
}

export const deleteComponent = async (id: string) => {
  const component = await deleteComponentRepository(id)
  
  if (!component) {
    throw new HTTPException(404, { message: 'Componente no encontrado' })
  }
  
  return component
}

export const searchComponents = async (query: string) => {
  if (!query) {
    throw new HTTPException(400, { message: 'El parámetro de búsqueda es requerido' })
  }
  
  return await searchComponentsRepository(query)
}