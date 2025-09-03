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

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>


export default { 
  loginSchema, 
  registerSchema
}