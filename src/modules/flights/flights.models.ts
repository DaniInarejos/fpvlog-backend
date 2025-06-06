import { Schema, model, Document, Types } from 'mongoose'

export interface IFlight extends Document {
  title: string
  description: string
  date: Date
  location: string
  userId: Types.ObjectId
  droneId: Types.ObjectId
  createdAt: Date
}

const flightSchema = new Schema<IFlight>({
  title: { 
    type: String, 
    required: [true, 'El título es requerido']
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es requerida']
  },
  date: { 
    type: Date, 
    required: [true, 'La fecha es requerida']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  droneId: {
    type: Schema.Types.ObjectId,
    ref: 'Drone',
    required: [true, 'El ID del drone es requerido']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

export default model<IFlight>('Flight', flightSchema)