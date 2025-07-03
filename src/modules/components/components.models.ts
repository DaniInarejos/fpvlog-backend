import { Schema, model, Document, Types } from 'mongoose'

export type ComponentType = 'FRAME' | 'MOTOR' | 'ESC' | 'FC' | 'CAMERA' | 'VTX' | 'ANTENNA' | 'RECEIVER' | 'BATTERY' | 'PROPS' | 'MOUNT' | 'OTHER'

export interface IComponent extends Document {
  name: string
  brand: string
  type: ComponentType
  description: string
  image: string
  sourceUrl?: string
  weightGrams?: number
  createdBy?: Types.ObjectId
  createdAt: Date
}

const componentSchema = new Schema<IComponent>({
  name: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  brand: {
    type: String,
  },
  type: {
    type: String,
    enum: ['FRAME', 'MOTOR', 'ESC', 'FC', 'CAMERA', 'VTX', 'ANTENNA', 'RECEIVER', 'BATTERY', 'PROPS', 'MOUNT', 'OTHER'],
    required: [true, 'El tipo de componente es requerido']
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  sourceUrl: String,
  weightGrams: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Debe crearlo un Usuario']

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default model<IComponent>('Component', componentSchema)