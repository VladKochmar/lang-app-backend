import WordController from '../controllers/word.controller.mjs'
import WordValidator from '../../../validators/word.validator.mjs'

import { Router } from 'express'
import { checkSchema } from 'express-validator'
const router = Router()

router.get('/', WordController.getWordsList)

router.get('/total-count', WordController.getTotalCount)

router.get('/:id', WordController.getWordById)

router.post('/add', checkSchema(WordValidator.wordSchema), WordController.addWord)

router.put('/update/:id', checkSchema(WordValidator.wordSchema), WordController.updateWord)

router.delete('/', WordController.deleteWord)

export default router
