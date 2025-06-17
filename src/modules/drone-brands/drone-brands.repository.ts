import DroneBrand, { IDroneBrand } from './drone-brands.models'

export async function getAllDroneBrandsRepository(): Promise<IDroneBrand[]> {
  return await DroneBrand.find().sort({ name: 1 })
}

export async function getDroneBrandByIdRepository(id: string): Promise<IDroneBrand | null> {
  return await DroneBrand.findById(id)
}

export async function createDroneBrandRepository(brandData: Partial<IDroneBrand>): Promise<IDroneBrand> {
  const brand = new DroneBrand(brandData)
  return await brand.save()
}

export async function updateDroneBrandRepository(id: string, updateData: Partial<IDroneBrand>): Promise<IDroneBrand | null> {
  return await DroneBrand.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
}

export async function deleteDroneBrandRepository(id: string): Promise<boolean> {
  const result = await DroneBrand.findByIdAndDelete(id)
  return !!result
}

export async function findDroneBrandByNameRepository(name: string): Promise<IDroneBrand | null> {
  return await DroneBrand.findOne({ name: { $regex: new RegExp(name, 'i') } })
}

export async function getDroneBrandsByCountryRepository(country: string): Promise<IDroneBrand[]> {
  return await DroneBrand.find({ country: { $regex: new RegExp(country, 'i') } }).sort({ name: 1 })
}