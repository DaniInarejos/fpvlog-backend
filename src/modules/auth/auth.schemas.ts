import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email')
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>


export default { 
  loginSchema, 
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema
}