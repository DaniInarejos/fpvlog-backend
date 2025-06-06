import { Types } from 'mongoose'
import FlightModel, { IFlight } from './flights.models'

export async function createFlightRepository(data: Partial<IFlight>): Promise<IFlight> {
  const flight = new FlightModel(data)
  return await flight.save()
}

export async function getAllFlightsRepository(): Promise<IFlight[]> {
  return await FlightModel.find().select('-__v')
}

export async function getFlightsByUserRepository(userId: Types.ObjectId): Promise<IFlight[]> {
  return await FlightModel.find({ userId }).select('-__v')
}

export async function getFlightByIdRepository(id: string): Promise<IFlight | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de vuelo inválido')
  }
  return await FlightModel.findById(id).select('-__v')
}

export async function updateFlightRepository(id: string, data: Partial<IFlight>): Promise<IFlight | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de vuelo inválido')
  }
  return await FlightModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).select('-__v')
}

export async function deleteFlightRepository(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID de vuelo inválido')
  }
  const result = await FlightModel.findByIdAndDelete(id)
  return result !== null
}