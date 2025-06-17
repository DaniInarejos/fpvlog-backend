import DroneType, { IDroneType } from './drone-types.models'

export async function getAllDroneTypesRepository(): Promise<IDroneType[]> {
  return await DroneType.find().sort({ name: 1 })
}

export async function getDroneTypeByIdRepository(id: string): Promise<IDroneType | null> {
  return await DroneType.findById(id)
}

export async function createDroneTypeRepository(droneTypeData: Partial<IDroneType>): Promise<IDroneType> {
  const droneType = new DroneType(droneTypeData)
  return await droneType.save()
}

export async function updateDroneTypeRepository(id: string, updateData: Partial<IDroneType>): Promise<IDroneType | null> {
  return await DroneType.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
}

export async function deleteDroneTypeRepository(id: string): Promise<boolean> {
  const result = await DroneType.findByIdAndDelete(id)
  return !!result
}

export async function findDroneTypeByNameRepository(name: string): Promise<IDroneType | null> {
  return await DroneType.findOne({ name: { $regex: new RegExp(name, 'i') } })
}

export async function getDroneTypesByCategoryRepository(category: string): Promise<IDroneType[]> {
  return await DroneType.find({ category }).sort({ name: 1 })
}