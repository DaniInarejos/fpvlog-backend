import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { emailNormalizeMiddleware } from './middlewares/email-normalize.middleware'
import userRoutes from './modules/users/users.routes'
import authRoutes from './modules/auth/auth.routes'
import healtRoutes from './modules/health/health.routes'
import droneRoutes from './modules/drones/drones.routes'
import flightRoutes from './modules/flights/flights.routes'
import droneTypesRoutes from './modules/drone-types/drone-types.routes'
import droneBrandsRoutes from './modules/drone-brands/drone-brands.routes'
import followersRoutes from './modules/followers/followers.routes'
import feedsRouter from './modules/feeds/feeds.routes'
import { swaggerUI } from '@hono/swagger-ui'
import { openApiDoc } from './openapi'
import likesRouter from './modules/likes/likes.routes'

export const app = new Hono()

// Middlewares básicos
app.use('*', logger())
app.use('*', cors())
app.use('*', emailNormalizeMiddleware)


app.route('/health', healtRoutes)
app.route('/auth', authRoutes)
app.route('/users', userRoutes)
app.route('/flights', flightRoutes)
app.route('/drones', droneRoutes)
app.route('/drone-types', droneTypesRoutes)
app.route('/drone-brands', droneBrandsRoutes)
app.route('/followers', followersRoutes)
app.route('/feeds', feedsRouter)
app.route('/likes', likesRouter)

app.get('/api-doc', (c) => c.json(openApiDoc))
app.get('/docs', swaggerUI({ url: '/api-doc' }))


export default app

