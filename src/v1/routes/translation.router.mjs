import { checkSchema } from 'express-validator'
import TranslationController from '../controllers/translation.controller.mjs'
import TranslationValidator from '../../../validators/translation.validator.mjs'

import { Router } from 'express'
const router = Router()

router.get('/', TranslationController.getTranslationsList)

router.get('/:id', TranslationController.getTranslationById)

router.post('/add', checkSchema(TranslationValidator.translationSchema), TranslationController.addTranslation)

router.put('/update/:id', checkSchema(TranslationValidator.translationSchema), TranslationController.updateTranslation)

router.delete('/', TranslationController.deleteTranslation)

export default router
