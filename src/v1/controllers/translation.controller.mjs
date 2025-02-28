import ValidationChecker from '../../../utils/ValidationChecker.util.mjs'
import TranslationDBService from '../models/translation/TranslationDBService.model.mjs'

class TranslationController {
  static async getTranslationsList(req, res) {
    try {
      const { limit, offset, ...filters } = req.query

      const limitVal = limit ? parseInt(limit) : null
      const offsetVal = offset ? parseInt(offset) : null

      const data = await TranslationDBService.findMany(['*'], [], filters, limitVal, offsetVal)

      return res.status(200).json({
        ...data,
      })
    } catch (err) {
      res.status(500).json({ error: 'Error fetching translations' })
    }
  }

  static async getTranslationById(req, res) {
    try {
      const id = req.params.id
      const translation = await TranslationDBService.findById(id)

      return res.status(200).json({
        data: translation,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async addTranslation(req, res) {
    ValidationChecker.check(req, res)

    try {
      const translationData = req.body
      const id = await TranslationDBService.create(translationData)

      res.status(200).json({
        id,
        message: 'Translation successfully added',
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async updateTranslation(req, res) {
    ValidationChecker.check(req, res)

    try {
      const id = req.params.id
      const translationData = req.body

      await TranslationDBService.update(id, translationData)

      res.status(200).json({
        id,
        message: 'Translation successfully updated',
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async deleteTranslation(req, res) {
    try {
      const id = req.body.id
      await TranslationDBService.deleteById(id)
      return res.status(200).json({ id, message: 'Word deleted' })
    } catch (err) {
      res.status(500).json({ error: 'Error deleting word' })
    }
  }
}

export default TranslationController
