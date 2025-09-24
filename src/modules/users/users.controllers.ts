import { Context } from 'hono'
import { 
  getAllUsersService, 
  getUserByIdService, 
  updateUserService, 
  deleteUserService,
  getDashboardDataService,
  uploadProfileImageService,
  toggleEquipmentItemFavoriteService
} from './users.services'
import { getErrorMessage } from '../../utils/error'
import { getUserGroupsService } from '../groups/members/group-members.services'
import { 
  getEquipmentItemsByUserService,
  getEquipmentItemsByUserAndTypeService,
  getEquipmentItemsByUserAndStatusService,
  getEquipmentItemStatsService
} from '../equipmentItems/equipmentItems.services'
import { EquipmentType, EquipmentStatus } from '../equipmentItems/equipmentItems.models'

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

export const getEquipmentItemsByUserController = async (context: Context): Promise<Response> => {
  try {
    const userId = context.req.param('id')
    const { type, status } = context.req.query()
    const currentUser = context.get('user')
    
    // Verificar que el usuario solo pueda ver sus propios equipmentItems
    if (currentUser._id.toString() !== userId) {
      return context.json({ error: 'No autorizado para ver los equipmentItems de este usuario' }, 403)
    }
    
    let equipmentItems
    
    if (type && Object.values(EquipmentType).includes(type as EquipmentType)) {
      equipmentItems = await getEquipmentItemsByUserAndTypeService(userId, type as EquipmentType)
    } else if (status && Object.values(EquipmentStatus).includes(status as EquipmentStatus)) {
      equipmentItems = await getEquipmentItemsByUserAndStatusService(userId, status as EquipmentStatus)
    } else {
      equipmentItems = await getEquipmentItemsByUserService(userId)
    }
    
    return context.json({
      success: true,
      data: equipmentItems,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('inválido') ? 400 : 500
    
    return context.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, statusCode as any)
  }
}

export const getEquipmentItemStatsController = async (c: Context) => {
  try {
    const userId = c.req.param('id')
   const currentUser = c.get('user')

    // Verificar autorización
    if (userId !== currentUser._id.toString()) {
      return c.json({ error: 'No autorizado' }, 403)
    }

    const stats = await getEquipmentItemStatsService(userId)
    return c.json(stats)
  } catch (error) {
    return c.json({ error: getErrorMessage(error) }, 500)
  }
}

export const toggleEquipmentItemFavoriteController = async (c: Context) => {
  try {
    const equipmentItemId = c.req.param('equipmentItemId')
    const userId = c.get('userId')

    const updatedEquipmentItem = await toggleEquipmentItemFavoriteService(equipmentItemId, userId)
    return c.json(updatedEquipmentItem)
  } catch (error) {
    return c.json({ error: getErrorMessage(error) }, 500)
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

export const getUserGroupsController = async (context: Context): Promise<Response> => {
  try {
    const userId = context.req.param('id')
    const currentUser = context.get('user')
    
    // Verificar que el usuario solo pueda ver sus propios grupos
    if (currentUser._id.toString() !== userId) {
      return context.json({ error: 'No autorizado para ver los grupos de este usuario' }, 403)
    }
    
    const userGroups = await getUserGroupsService(userId)
    
    // Formatear la respuesta con información adicional
    const response = {
      groups: userGroups,
      summary: {
        totalGroups: userGroups.length,
        ownedGroups: userGroups.filter(ug => ug.role === 'OWNER').length,
        adminGroups: userGroups.filter(ug => ug.role === 'ADMIN').length,
        memberGroups: userGroups.filter(ug => ug.role === 'MEMBER').length
      }
    }
    
    return context.json(response)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}
