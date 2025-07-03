import { Context } from 'hono'
import {
  createComponent,
  deleteComponent,
  getAllComponents,
  getComponentById,
  getComponentsByType,
  getComponentsByUser,
  searchComponents,
  updateComponent
} from './components.service'

export const getAllComponentsController = async (context: Context) => {
  const components = await getAllComponents()
  return context.json(components)
}

export const getComponentByIdController = async (context: Context) => {
  const id = context.req.param('id')
  const component = await getComponentById(id)
  return context.json(component)
}

export const getComponentsByTypeController = async (context: Context) => {
  const type = context.req.param('type')
  const components = await getComponentsByType(type)
  return context.json(components)
}

export const getComponentsByUserController = async (context: Context) => {
  const userId = context.req.param('userId')
  const components = await getComponentsByUser(userId)
  return context.json(components)
}

export const createComponentController = async (context: Context) => {
  const body = await context.req.json()
  const component = await createComponent(body)
  return context.json(component, 201)
}

export const updateComponentController = async (context: Context) => {
  const id = context.req.param('id')
  const body = await context.req.json()
  const component = await updateComponent(id, body)
  return context.json(component)
}

export const deleteComponentController = async (context: Context) => {
  const id = context.req.param('id')
  await deleteComponent(id)
  return context.json({ message: 'Componente eliminado correctamente' })
}

export const searchComponentsController = async (context: Context) => {
  const query = context.req.query('q')
  const components = await searchComponents(query)
  return context.json(components)
}