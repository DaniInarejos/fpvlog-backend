import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import userRoutes from './modules/users/users.routes'
import authRoutes from './modules/auth/auth.routes'
import healtRoutes from './modules/health/health.routes'
import droneRoutes from './modules/drones/drones.routes'
import flightRoutes from './modules/flights/flights.routes'

export const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.route('/health', healtRoutes)
app.route('/auth', authRoutes)
app.route('/users', userRoutes)
app.route('/flights', flightRoutes)
app.route('/drones', droneRoutes)
