import { Hono } from 'hono'
import { healthController } from './health.controllers'

const router = new Hono()

router.get('/',healthController)

export default router
