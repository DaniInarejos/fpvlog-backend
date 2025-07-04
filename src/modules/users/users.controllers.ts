import { Context } from 'hono'
import { 
  getAllUsersService, 
  getUserByIdService, 
  updateUserService, 
  deleteUserService,
  getDashboardDataService,
  uploadProfileImageService
} from './users.services'
import { getErrorMessage } from '../../utils/error'
import { findComponentsByUserGroupedRepository } from '../components/components.repository'

export async function getAllUsersController(context: Context): Promise<Response> {
  try {
    const users = await getAllUsersService()
    return context.json(users)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 500)
  }
}

export async function getUserByIdController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const user = await getUserByIdService(id)
    if (!user) {
      return context.json({ error: 'User not found' }, 404)
    }
    return context.json(user)
  } catch (error) {
    return context.json({ error:getErrorMessage(error) }, 400)
  }
}

export async function updateUserController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const currentUser = context.get('user')
    if (currentUser._id.toString() !== id) {
      return context.json({ error: 'Not authorized to update this user' }, 403)
    }

    const data = await context.req.json()
    const user = await updateUserService(id, data)
    if (!user) {
      return context.json({ error: 'User not found' }, 404)
    }
    return context.json(user)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export async function deleteUserController(context: Context): Promise<Response> {
  try {
    const id = context.req.param('id')
    const currentUser = context.get('user')
    
    if (currentUser._id.toString() !== id) {
      return context.json({ error: 'Not authorized to delete this user' }, 403)
    }

    const deleted = await deleteUserService(id)
    if (!deleted) {
      return context.json({ error: 'User not found' }, 404)
    }
    
    return context.json({ message: 'User deleted successfully' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}
import User from './users.models'


export const createUserController = async (context: Context): Promise<Response> => {
  const data = await context.req.json()
  const user = await User.create(data)
  return context.json(user)
}

export const getProfileController = async (context: Context): Promise<Response> => {
    const {_id:id} = context.get('user')
    const user = await getUserByIdService(id) 
       return context.json(user)
}

export const getDashboardController = async (context: Context): Promise<Response> => {
  try {
    const username = context.req.param('username')
    const dashboardData = await getDashboardDataService(username)
    return context.json(dashboardData)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const uploadProfileImageController = async (context: Context): Promise<Response> => {
  try {
    const id = context.req.param('id')
    const currentUser = context.get('user')
    
    if (currentUser._id.toString() !== id) {
      return context.json({ error: 'No autorizado para actualizar este usuario' }, 403)
    }

    const body = await context.req.parseBody()
    const file = body.image

    if (!file || !(file instanceof File)) {
      return context.json({ error: 'No se proporcionó ninguna imagen válida' }, 400)
    }

    const downloadURL = await uploadProfileImageService(id, file)
    
    return context.json({
      profilePicture: downloadURL
    })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getUserComponentsController = async (context: Context) => {
  const userId = context.req.param('id')
  
  try {
    const components = await findComponentsByUserGroupedRepository(userId)
    return context.json(components)
  } catch (error) {
    return context.json({ error: 'Error al obtener los componentes del usuario' }, 500)
  }
}
