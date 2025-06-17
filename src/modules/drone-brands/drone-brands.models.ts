import { Schema, model, Document } from 'mongoose'

export interface IDroneBrand extends Document {
  name: string
  description?: string
  website?: string
  country?: string
  founded?: number
  createdAt: Date
  updatedAt: Date
}

const droneBrandSchema = new Schema<IDroneBrand>({
  name: {
    type: String,
    required: [true, 'El nombre de la marca es requerido'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  founded: {
    type: Number,
    min: [1900, 'El año de fundación debe ser mayor a 1900'],
    max: [new Date().getFullYear(), 'El año de fundación no puede ser futuro']
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

droneBrandSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default model<IDroneBrand>('DroneBrand', droneBrandSchema)