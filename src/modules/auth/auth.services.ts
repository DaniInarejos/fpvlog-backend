import jwt from 'jsonwebtoken'
import { IUser } from '../users/users.models'
import UserModel from '../users/users.models'
import { LoginDTO, RegisterDTO } from './auth.dto'
import { getUserByIdService } from '../users/users.services'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '24h'

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

    const token = generateToken(user)

    const userResponse = user.toObject()
    delete userResponse.password

    return { user: userResponse, token }
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`)
  }
}

export const login = async (credentials: LoginDTO): Promise<{ user: IUser; token: string }> => {
    const user = await UserModel.findOne({ email: credentials.email })
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

export default  {login, register, validateToken, generateToken}