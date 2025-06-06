import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import authSchemas  from './auth.schemas'
import authController from './auth.controllers'

const auth = new Hono()

auth.post('/register', zValidator('json', authSchemas.registerSchema), authController.registerUser)
auth.post('/login', zValidator('json', authSchemas.loginSchema), authController.loginUser)

export default auth