import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  points: number
  createdAt: Date
  name: string
  lastName: string
  profilePicture?: string 
  followers: Types.ObjectId[]
  following: Types.ObjectId[]
  privacySettings: {
    allowFollowersToSeeFlights: boolean
    allowFollowersToSeeDrones: boolean
    profileVisibility: 'public' | 'followers' | 'private'
  }
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: [true, 'El nombre de usuario es requerido'],
    unique: true
  },
  email: { 
    type: String, 
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  points: { 
    type: Number, 
    default: 0 
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido']
  },
  profilePicture: {
    type: String,
    required: false,
    default: null
  },
  // Nuevos campos
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  privacySettings: {
    allowFollowersToSeeFlights: {
      type: Boolean,
      default: true
    },
    allowFollowersToSeeDrones: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default model<IUser>('User', userSchema)
