import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  points: number
  createdAt: Date
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
