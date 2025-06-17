import {
  getAllDroneTypesRepository,
  getDroneTypeByIdRepository,
  createDroneTypeRepository,
  updateDroneTypeRepository,
  deleteDroneTypeRepository,
  findDroneTypeByNameRepository,
  getDroneTypesByCategoryRepository
} from './drone-types.repository'
import { IDroneType } from './drone-types.models'

export async function getAllDroneTypesService(): Promise<IDroneType[]> {
  return await getAllDroneTypesRepository()
}

export async function getDroneTypeByIdService(id: string): Promise<IDroneType | null> {
  return await getDroneTypeByIdRepository(id)
}

export async function createDroneTypeService(droneTypeData: Partial<IDroneType>): Promise<IDroneType> {
  const existingType = await findDroneTypeByNameRepository(droneTypeData.name!)
  if (existingType) {
    throw new Error('A drone type with this name already exists')
  }
  return await createDroneTypeRepository(droneTypeData)
}

export async function updateDroneTypeService(id: string, updateData: Partial<IDroneType>): Promise<IDroneType | null> {
  if (updateData.name) {
    const existingType = await findDroneTypeByNameRepository(updateData.name)
    if (existingType && existingType._id && existingType._id.toString() !== id) {
      throw new Error('A drone type with this name already exists')
    }
  }
  return await updateDroneTypeRepository(id, updateData)
}

export async function deleteDroneTypeService(id: string): Promise<boolean> {
  return await deleteDroneTypeRepository(id)
}

export async function getDroneTypesByCategoryService(category: string): Promise<IDroneType[]> {
  return await getDroneTypesByCategoryRepository(category)
}