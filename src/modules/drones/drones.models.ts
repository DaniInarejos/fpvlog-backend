import { Schema, model, Document, Types } from 'mongoose'

export interface IDrone extends Document<any> {
  name: string
  typeId: Types.ObjectId
  brandId: Types.ObjectId
  model: string
  serialNumber: string
  weight: number
  frameSize: number
  notes?: string
  description?: string
  userId: Types.ObjectId
  createdAt: Date
  visibility: {
    isVisibleToFollowers: boolean
    isPublic: boolean
  }
}

const droneSchema = new Schema<IDrone>({
  name: { 
    type: String, 
    required: [true, 'El nombre es requerido']
  },
  typeId: {
    type: Schema.Types.ObjectId,
    ref: 'DroneType',
    required: [true, 'El tipo de drone es requerido']
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'DroneBrand',
    required: [true, 'La marca del drone es requerida']
  },
  model: { 
    type: String, 
    required: [true, 'El modelo es requerido']
  },
  serialNumber: {
    type: String,
    required: [true, 'El número de serie es requerido'],
    unique: true
  },
  weight: {
    type: Number,
    required: [true, 'El peso es requerido'],
    min: [0, 'El peso debe ser mayor a 0']
  },
  frameSize: {
    type: Number,
    required: [true, 'El tamaño del frame es requerido'],
    min: [0, 'El tamaño del frame debe ser mayor a 0']
  },
  notes: {
    type: String
  },
  description: { 
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  visibility: {
    isVisibleToFollowers: {
      type: Boolean,
      default: true
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

export default model<IDrone>('Drone', droneSchema)