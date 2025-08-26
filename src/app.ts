import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { filterOptionsLogger } from './middlewares/filter-options-logger.middleware'
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
import componentRoutes from './modules/components/components.routes'
import spotsRouter from './modules/spots/spots.routes'
import groupsRouter from './modules/groups/groups.routes'
import aeronauticsRoutes from './modules/aeronautics/aeronautics.routes'

export const app = new Hono()

// Middleware personalizado para filtrar OPTIONS y /health
app.use('*', filterOptionsLogger())
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
app.route('/components', componentRoutes)
app.route('/likes', likesRouter)
app.route('/spots', spotsRouter)
app.route('/groups', groupsRouter)
app.route('/aeronautics', aeronauticsRoutes)

app.get('/api-doc', (c) => c.json(openApiDoc))
app.get('/docs', swaggerUI({ url: '/api-doc' }))


export default app

