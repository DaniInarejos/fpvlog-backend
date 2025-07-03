import { Types } from 'mongoose'
import Spot from './spots.models'
import type { ISpot } from './spots.models'

type CreateSpotData = Omit<ISpot, '_id' | 'createdAt'>
type UpdateSpotData = Partial<CreateSpotData>

export const findAllSpotsRepository = async () => {
  return await Spot.find().sort({ createdAt: -1 })
}

export const findSpotByIdRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Spot.findById(id)
}

export const findSpotsByUserRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) return []
  return await Spot.find({ submittedBy: userId }).sort({ createdAt: -1 })
}

export const createSpotRepository = async (data: CreateSpotData) => {
  const spot = new Spot(data)
  return await spot.save()
}

export const updateSpotRepository = async (id: string, data: UpdateSpotData) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Spot.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

export const deleteSpotRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Spot.findByIdAndDelete(id)
}