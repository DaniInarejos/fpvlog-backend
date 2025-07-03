import { Schema, model, Document, Types } from 'mongoose'

export type DroneOriginType = 'CUSTOM' | 'BRANDED'

export interface IDrone extends Document {
  name: string
  typeId?: Types.ObjectId
  brandId?: Types.ObjectId
  model?: string
  serialNumber?: string
  weight?: number
  frameSize?: number
  notes?: string
  description?: string
  userId: Types.ObjectId
  originType: DroneOriginType
  visibility?: {
    isVisibleToFollowers: boolean
    isPublic: boolean
  }
  image?: string
  components?: {
    frameId?: Types.ObjectId
    motors?: Types.ObjectId[]
    flightControllerId?: Types.ObjectId
    escId?: Types.ObjectId
    vtxId?: Types.ObjectId
    cameraId?: Types.ObjectId
    antennaId?: Types.ObjectId
    receiverId?: Types.ObjectId
    batteryId?: Types.ObjectId
    propsId?: Types.ObjectId
    mountId?: Types.ObjectId
    others?: Types.ObjectId[]
  }
  betaflightId?:Types.ObjectId
  createdAt: Date
}

const droneSchema = new Schema<IDrone>({
  name: { 
    type: String, 
    required: [true, 'El nombre es requerido']
  },
  typeId: {
    type: Schema.Types.ObjectId,
    ref: 'DroneType'
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'DroneBrand'
  },
  model: { 
    type: String
  },
  serialNumber: {
    type: String
  },
  weight: {
    type: Number,
  },
  frameSize: {
    type: Number,
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
  originType: {
    type: String,
    enum: ['CUSTOM', 'BRANDED'],
    required: [true, 'El tipo de origen es requerido']
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
  components: {
    frameId: { type: Schema.Types.ObjectId, ref: 'Component' },
    motors: [{ type: Schema.Types.ObjectId, ref: 'Component' }],
    flightControllerId: { type: Schema.Types.ObjectId, ref: 'Component' },
    escId: { type: Schema.Types.ObjectId, ref: 'Component' },
    vtxId: { type: Schema.Types.ObjectId, ref: 'Component' },
    cameraId: { type: Schema.Types.ObjectId, ref: 'Component' },
    antennaId: { type: Schema.Types.ObjectId, ref: 'Component' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Component' },
    batteryId: { type: Schema.Types.ObjectId, ref: 'Component' },
    propsId: { type: Schema.Types.ObjectId, ref: 'Component' },
    mountId: { type: Schema.Types.ObjectId, ref: 'Component' },
    others: [{ type: Schema.Types.ObjectId, ref: 'Component' }]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  image: {
    type: String,
    default: null
  },
  betaflightId:{ type: Schema.Types.ObjectId, ref: 'Betaflight' }
})

export default model<IDrone>('Drone', droneSchema)