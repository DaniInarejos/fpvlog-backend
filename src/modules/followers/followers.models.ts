import { Schema, model, Document, Types } from 'mongoose'

export interface IFollower extends Document {
  follower: Types.ObjectId 
  following: Types.ObjectId
  createdAt: Date
}

const followerSchema = new Schema<IFollower>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del seguidor es requerido']
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario seguido es requerido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Índice compuesto para evitar duplicados
followerSchema.index({ follower: 1, following: 1 }, { unique: true })

export default model<IFollower>('Follower', followerSchema)