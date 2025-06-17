import { Schema, model, Document } from 'mongoose'

export interface IDroneType extends Document {
  name: string
  description?: string
  category: 'racing' | 'freestyle' | 'cinematic' | 'commercial' | 'other'
  createdAt: Date
  updatedAt: Date
}

const droneTypeSchema = new Schema<IDroneType>({
  name: {
    type: String,
    required: [true, 'El nombre del tipo es requerido'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['racing', 'freestyle', 'cinematic', 'commercial', 'other'],
    required: [true, 'La categoría es requerida']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

droneTypeSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default model<IDroneType>('DroneType', droneTypeSchema)