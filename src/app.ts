import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { filterOptionsLogger } from './middlewares/filter-options-logger.middleware'
import { emailNormalizeMiddleware } from './middlewares/email-normalize.middleware'
import userRoutes from './modules/users/users.routes'
import authRoutes from './modules/auth/auth.routes'
import healtRoutes from './modules/health/health.routes'
import flightRoutes from './modules/flights/flights.routes'

import followersRoutes from './modules/followers/followers.routes'
import feedsRouter from './modules/feeds/feeds.routes'
import { swaggerUI } from '@hono/swagger-ui'
import { openApiDoc } from './openapi'
import likesRouter from './modules/likes/likes.routes'
import spotsRouter from './modules/spots/spots.routes'
import groupsRouter from './modules/groups/groups.routes'
import aeronauticsRoutes from './modules/aeronautics/aeronautics.routes'
import equipmentItemsRouter from './modules/equipmentItems/equipmentItems.routes'

export const app = new Hono()

// Middleware personalizado para filtrar OPTIONS y /health
app.use('*', filterOptionsLogger())
app.use('*', cors())
app.use('*', emailNormalizeMiddleware)


app.route('/health', healtRoutes)
app.route('/auth', authRoutes)
app.route('/users', userRoutes)
app.route('/flights', flightRoutes)

app.route('/followers', followersRoutes)
app.route('/feeds', feedsRouter)
app.route('/likes', likesRouter)
app.route('/spots', spotsRouter)
app.route('/groups', groupsRouter)
app.route('/aeronautics', aeronauticsRoutes)
app.route('/equipment-items', equipmentItemsRouter)

app.get('/api-doc', (c) => c.json(openApiDoc))
app.get('/docs', swaggerUI({ url: '/api-doc' }))


export default app

