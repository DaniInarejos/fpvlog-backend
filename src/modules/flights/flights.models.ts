import { Schema, model, Document, Types } from 'mongoose'

export interface IFlight extends Document {
  title: string
  description: string
  date: Date
  location: string
  duration: number
  batteryUsed: number
  weather: string
  notes?: string
  userId: Types.ObjectId
  droneId: Types.ObjectId
  createdAt: Date
  visibility: {
    isVisibleToFollowers: boolean
    isPublic: boolean
  }
  image?: string
}

const flightSchema = new Schema<IFlight>({
  title: { 
    type: String, 
    required: [true, 'El título es requerido']
  },
  date: { 
    type: Date, 
    required: [true, 'La fecha es requerida']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [0, 'La duración debe ser mayor a 0']
  },
  batteryUsed: {
    type: Number,
    required: [true, 'El número de baterías usadas es requerido'],
    min: [0, 'El número de baterías debe ser mayor o igual a 0']
  },
  weather: {
    type: String,
    required: [true, 'El clima es requerido']
  },
  notes: {
    type: String
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
  visibility: {
    isVisibleToFollowers: {
      type: Boolean,
      default: true
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  image: {
    type: String,
    default: null
  }
})

export default model<IFlight>('Flight', flightSchema)