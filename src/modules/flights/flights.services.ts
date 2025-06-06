import { Types } from 'mongoose'
import { IFlight } from './flights.models'
import { 
  getAllFlightsRepository, 
  getFlightByIdRepository, 
  updateFlightRepository, 
  deleteFlightRepository,
  createFlightRepository,
  getFlightsByUserRepository
} from './flights.repository'

export async function createFlightService(data: Partial<IFlight>): Promise<IFlight> {
  return await createFlightRepository(data)
}

export async function getAllFlightsService(): Promise<IFlight[]> {
  return await getAllFlightsRepository()
}

export async function getFlightsByUserService(userId: Types.ObjectId): Promise<IFlight[]> {
  return await getFlightsByUserRepository(userId)
}

export async function getFlightByIdService(id: string): Promise<IFlight | null> {
  return await getFlightByIdRepository(id)
}

export async function updateFlightService(id: string, data: Partial<IFlight>): Promise<IFlight | null> {
  return await updateFlightRepository(id, data)
}

export async function deleteFlightService(id: string): Promise<boolean> {
  return await deleteFlightRepository(id)
}