import { Types } from 'mongoose'
import DroneModel, { IDrone } from './drones.models'

export async function createDroneRepository(data: Partial<IDrone>): Promise<IDrone> {
  const drone = new DroneModel(data)
  return await drone.save()
}

export async function getAllDronesRepository(): Promise<IDrone[]> {
  return await DroneModel.find().select('-__v')
}

export async function getDronesByUserRepository(userId: Types.ObjectId): Promise<IDrone[]> {
  return await DroneModel.find({ userId }).select('-__v')
}

export async function getDroneByIdRepository(id: string): Promise<IDrone | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de drone inválido')
  }
  return await DroneModel.findById(id).select('-__v')
}

export async function updateDroneRepository(id: string, data: Partial<IDrone>): Promise<IDrone | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de drone inválido')
  }
  return await DroneModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-__v')
}

export async function deleteDroneRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de drone inválido')
  }
  const result = await DroneModel.findByIdAndDelete(id)
  return result !== null
}