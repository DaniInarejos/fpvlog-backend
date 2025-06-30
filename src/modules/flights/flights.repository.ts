import { Types } from 'mongoose'
import FlightModel, { IFlight } from './flights.models'
import { cacheService } from '../../configs/cache'
import { getFlightsByUserAggregation } from './flights.aggregations'

export async function createFlightRepository(data: Partial<IFlight>): Promise<IFlight> {
  const flight = new FlightModel(data)
  const result = await flight.save()
  
  await cacheService.deleteMany([
    'flights:all',
    `flights:user:${data.userId}`
  ])
  
  return result
}

export async function getAllFlightsRepository(): Promise<IFlight[]> {
  console.time('getAllFlightsRepository')
  const cacheKey = 'flights:all'
  
  const flights = await cacheService.loadData<IFlight[]>(
    cacheKey,
    async () => await FlightModel.find().select('-__v')
  )
  
  console.timeEnd('getAllFlightsRepository')
  return flights
}

export async function getFlightsByUserRepository(userId: Types.ObjectId): Promise<IFlight[]> {
  const cacheKey = `flights:user:${userId}`
  
  return await cacheService.loadData<IFlight[]>(
    cacheKey,
    async () => await FlightModel.aggregate(getFlightsByUserAggregation(userId))
  )
}

export async function getFlightByIdRepository(id: string): Promise<IFlight | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid flight ID')
  }
  
  const cacheKey = `flight:${id}`
  return await cacheService.loadData<IFlight | null>(
    cacheKey,
    async () => await FlightModel.findById(id).select('-__v')
  )
}

export async function updateFlightRepository(id: string, data: Partial<IFlight>): Promise<IFlight | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid flight ID')
  }
  
  const result = await FlightModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-__v')
  
  if (result) {
    await cacheService.deleteMany([
      `flight:${id}`,
      'flights:all',
      `flights:user:${result.userId}`
    ])
  }
  
  return result
}

export async function deleteFlightRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid flight ID')
  }
  
  const flight = await FlightModel.findById(id)
  if (!flight) return false
  
  const result = await FlightModel.findByIdAndDelete(id)
  
  if (result) {
    await cacheService.deleteMany([
      `flight:${id}`,
      'flights:all',
      `flights:user:${flight.userId}`
    ])
  }
  
  return result !== null
}

export const getVisibleFlightsRepository = async (
  query: any,
  skip: number,
  limit: number
) => {
  const flights = await FlightModel.find(query)
    .populate('userId', 'username name lastName')
    .populate('droneId', 'name model')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select('-__v')

  const total = await FlightModel.countDocuments(query)

  return {
    flights,
    total
  }
}