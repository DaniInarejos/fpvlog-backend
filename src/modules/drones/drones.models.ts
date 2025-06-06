import { Schema, model, Document, Types } from 'mongoose'

export interface IDrone extends Document<any> {
  name: string
  model: string
  description?: string
  userId: Types.ObjectId
  createdAt: Date
}

const droneSchema = new Schema<IDrone>({
  name: { 
    type: String, 
    required: [true, 'El nombre es requerido']
  },
  model: { 
    type: String, 
    required: [true, 'El modelo es requerido']
  },
  description: { 
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

export default model<IDrone>('Drone', droneSchema)