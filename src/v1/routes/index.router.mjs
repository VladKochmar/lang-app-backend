import wordRoutes from './word.router.mjs'
import translationRoutes from './translation.router.mjs'

import { Router } from 'express'
const routes = Router()

routes.use('/words', wordRoutes)
routes.use('/translations', translationRoutes)

export default routes
