import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { IUser } from '../users/users.models'
import UserModel from '../users/users.models'
import { LoginDTO, RegisterDTO, RequestPasswordResetDTO, ResetPasswordDTO } from './auth.dto'
import { getUserByIdService } from '../users/users.services'
import { addMemberRepository } from '../groups/members/group-members.repository'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../../utils/mailer'
import { Types } from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '24h'

// ID del grupo por defecto al que se unirán todos los nuevos usuarios
const DEFAULT_GROUP_ID = '688408178e71e9e9de944b1a'

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export const register = async (userData: RegisterDTO): Promise<{ user: IUser; token: string }> => {
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    })

    if (existingUser) {
      throw new Error('User or email already exists')
    }

    const user = new UserModel(userData)
    await user.save()

    // Automáticamente unir al usuario al grupo por defecto
    try {
      if (Types.ObjectId.isValid(DEFAULT_GROUP_ID)) {
        await addMemberRepository(DEFAULT_GROUP_ID, user._id.toString(), 'MEMBER')
      }
    } catch (groupError) {
      // Log el error pero no fallar el registro si hay problemas con el grupo
      console.warn(`No se pudo agregar el usuario al grupo por defecto: ${groupError.message}`)
    }

    const token = generateToken(user)

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.username).catch(error => {
      console.warn(`Failed to send welcome email to ${user.email}:`, error.error || error.message)
    })

    const userResponse = user.toObject()
    delete userResponse.password

    return { user: userResponse, token }
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`)
  }
}

export const login = async (credentials: LoginDTO): Promise<{ user: IUser; token: string }> => {
    // Primero buscar por email
    let user = await UserModel.findOne({ email: credentials.email })
    
    // Si no se encuentra por email, buscar por username
    if (!user) {
      user = await UserModel.findOne({ username: { $regex: new RegExp(`^${credentials.email}$`, 'i') } })
    }
    
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await user.comparePassword(credentials.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = generateToken(user)

    const userResponse = user.toObject()
    const { password, ...userWithoutPassword } = userResponse;

    return { user: userWithoutPassword as unknown as IUser, token }
 
}

export const validateToken = async (token: string): Promise<IUser> => {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const user = await getUserByIdService(decoded.id)
    
    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export const requestPasswordReset = async (data: RequestPasswordResetDTO): Promise<void> => {
  try {
    const user = await UserModel.findOne({ email: data.email })
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return
    }

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Guardar token en la base de datos
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpires
    await user.save()

    // Enviar email (non-blocking)
    sendPasswordResetEmail(user.email, user.username, resetToken).catch(error => {
      console.warn(`Failed to send password reset email to ${user.email}:`, error.error || error.message)
    })
  } catch (error) {
    throw new Error(`Password reset request error: ${error.message}`)
  }
}

export const resetPassword = async (data: ResetPasswordDTO): Promise<void> => {
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: data.token,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      throw new Error('Invalid or expired reset token')
    }

    // Actualizar contraseña
    user.password = data.newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
  } catch (error) {
    throw new Error(`Password reset error: ${error.message}`)
  }
}

export default { login, register, validateToken, generateToken, requestPasswordReset, resetPassword }