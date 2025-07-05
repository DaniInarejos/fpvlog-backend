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
  spotId?: Types.ObjectId
  createdAt: Date
  visibility: {
    isVisibleToFollowers: boolean
    isPublic: boolean
  }
  image?: string,
  urlVideo?: string
}

const flightSchema = new Schema<IFlight>({
  title: { 
    type: String, 
    required: [true, 'El título es requerido']
  },
  date: { 
    type: Date, 
  },
  duration: {
    type: Number,
  },
  batteryUsed: {
    type: Number,
  },
  weather: {
    type: String,
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
    ref: 'Drone'
  },
  spotId: {
    type: Schema.Types.ObjectId,
    ref: 'Spot'
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
  },
  urlVideo:{
     type: String,
    default: null
  }
})

export default model<IFlight>('Flight', flightSchema)