import {
  findAllSpotsRepository,
  findSpotByIdRepository,
  findSpotsByUserRepository,
  createSpotRepository,
  updateSpotRepository,
  deleteSpotRepository
} from './spots.repository'


export const getAllSpotsService = async () => {
  return await findAllSpotsRepository()
}

export const getSpotByIdService = async (id: string) => {
  const spot = await findSpotByIdRepository(id)
  if (!spot) throw new Error('Spot no encontrado')
  return spot
}

export const getSpotsByUserService = async (userId: string) => {
  return await findSpotsByUserRepository(userId)
}

export const createSpotService = async (data: unknown) => {
  return await createSpotRepository(data as any)
}

export const updateSpotService = async (id: string, data: unknown) => {

  const updatedSpot = await updateSpotRepository(id, data as any)
  if (!updatedSpot) throw new Error('Spot no encontrado')
  return updatedSpot 
}

export const deleteSpotService = async (id: string) => {
  const deletedSpot = await deleteSpotRepository(id)
  if (!deletedSpot) throw new Error('Spot no encontrado')
  return deletedSpot
}