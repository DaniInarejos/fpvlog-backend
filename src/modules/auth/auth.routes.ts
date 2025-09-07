import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import authSchemas from './auth.schemas'
import authController from './auth.controllers'

const auth = new Hono()

auth.post('/register', zValidator('json', authSchemas.registerSchema), authController.registerUser)
auth.post('/login', zValidator('json', authSchemas.loginSchema), authController.loginUser)
auth.post('/request-password-reset', zValidator('json', authSchemas.requestPasswordResetSchema), authController.requestPasswordReset)
auth.post('/reset-password', zValidator('json', authSchemas.resetPasswordSchema), authController.resetPassword)

export default auth