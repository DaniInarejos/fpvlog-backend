import { Types } from 'mongoose'
import { IDrone } from './drones.models'
import {
  createDroneRepository,
  getAllDronesRepository,
  getDronesByUserRepository,
  getDroneByIdRepository,
  updateDroneRepository,
  deleteDroneRepository
} from './drones.repository'
import { uploadImageService } from '../../utils/image.service'

export async function createDroneService(data: Partial<IDrone>): Promise<IDrone> {
  return await createDroneRepository(data)
}

export async function getAllDronesService(): Promise<IDrone[]> {
  return await getAllDronesRepository()
}

export async function getDronesByUserService(userId: Types.ObjectId): Promise<IDrone[]> {
  return await getDronesByUserRepository(userId)
}

export async function getDroneByIdService(id: string): Promise<IDrone | null> {
  return await getDroneByIdRepository(id)
}

export async function updateDroneService(id: string, data: Partial<IDrone>): Promise<IDrone | null> {
  return await updateDroneRepository(id, data)
}

export async function deleteDroneService(id: string): Promise<boolean> {
  return await deleteDroneRepository(id)
}

export async function uploadDroneImageService(id: string, file: File): Promise<IDrone | null> {
  const imageUrl = await uploadImageService(file, {
    folder: 'drones',
    fileName: `drone-${id}`,
    maxSizeInMB: 5
  })
  return await updateDroneRepository(id, { image: imageUrl })
}