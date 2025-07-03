import { Schema, model, Document, Types } from 'mongoose'

export interface ISpot extends Document {
  name: string
  location: {
    type: string
    coordinates: number[]
    address: string
    city: string
    country: string
    placeId: string
  }
  description?: string
  submittedBy: Types.ObjectId
  visibility: {
    public: boolean
    visibleToFollowersOnly: boolean
  }
  createdAt: Date
}

const spotSchema = new Schema<ISpot>({
  name: {
    type: String,
    required: [true, 'El nombre del spot es requerido'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
    },
    address: String,
    city: String,
    country: String,
    placeId: String
  },
  description: String,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario que sube el spot es requerido']
  },
  visibility: {
    public: {
      type: Boolean,
      default: true
    },
    visibleToFollowersOnly: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Índice geoespacial para búsquedas por ubicación
spotSchema.index({ 'location.coordinates': '2dsphere' })

export default model<ISpot>('Spot', spotSchema)