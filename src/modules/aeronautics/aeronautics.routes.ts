import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth.middleware'
import { getAeronauticsDataController, refreshAeronauticsDataController } from './aeronautics.controllers';

const aeronauticsRoutes = new Hono();

//aeronauticsRoutes.use(authMiddleware)
// GET /aeronautics - Obtener datos de zonas aeronáuticas
aeronauticsRoutes.get('/', getAeronauticsDataController);

// POST /aeronautics/refresh - Refrescar datos manualmente
aeronauticsRoutes.post('/refresh', refreshAeronauticsDataController);

export default aeronauticsRoutes;