import {
  getAllDroneBrandsRepository,
  getDroneBrandByIdRepository,
  createDroneBrandRepository,
  updateDroneBrandRepository,
  deleteDroneBrandRepository,
  findDroneBrandByNameRepository,
  getDroneBrandsByCountryRepository
} from './drone-brands.repository'
import { IDroneBrand } from './drone-brands.models'

export async function getAllDroneBrandsService(): Promise<IDroneBrand[]> {
  return await getAllDroneBrandsRepository()
}

export async function getDroneBrandByIdService(id: string): Promise<IDroneBrand | null> {
  return await getDroneBrandByIdRepository(id)
}

export async function createDroneBrandService(brandData: Partial<IDroneBrand>): Promise<IDroneBrand> {
  const existingBrand = await findDroneBrandByNameRepository(brandData.name!)
  if (existingBrand) {
    throw new Error('A drone brand with this name already exists')
  }
  return await createDroneBrandRepository(brandData)
}

export async function updateDroneBrandService(id: string, updateData: Partial<IDroneBrand>): Promise<IDroneBrand | null> {
  if (updateData.name) {
    const existingBrand = await findDroneBrandByNameRepository(updateData.name)
    if (existingBrand && existingBrand._id && existingBrand._id.toString() !== id) {
      throw new Error('A drone brand with this name already exists')
    }
  }
  return await updateDroneBrandRepository(id, updateData)
}

export async function deleteDroneBrandService(id: string): Promise<boolean> {
  return await deleteDroneBrandRepository(id)
}

export async function getDroneBrandsByCountryService(country: string): Promise<IDroneBrand[]> {
  return await getDroneBrandsByCountryRepository(country)
}