import ValidationChecker from '../../../utils/ValidationChecker.util.mjs'
import WordDBService from '../models/word/WordDBService.model.mjs'

class WordController {
  static async getWordsList(req, res) {
    try {
      const { limit, offset, ...filters } = req.query

      const limitVal = limit ? parseInt(limit) : null
      const offsetVal = offset ? parseInt(offset) : null

      const data = await WordDBService.findMany(['*'], [], filters, limitVal, offsetVal)

      return res.status(200).json({
        ...data,
      })
    } catch (err) {
      res.status(500).json({ error: 'Error fetching words' })
    }
  }

  static async getTotalCount(req, res) {
    try {
      const { ...filters } = req.query
      const data = await WordDBService.getTotalCount(filters)

      res.status(200).json({
        data,
      })
    } catch (err) {
      res.status(500).json({ error: 'Error fetching total count of words' })
    }
  }

  static async getWordById(req, res) {
    try {
      const id = req.params.id
      const word = await WordDBService.findById(id)

      return res.status(200).json({
        data: word,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async addWord(req, res) {
    ValidationChecker.check(req, res)

    try {
      const wordData = req.body
      const id = await WordDBService.create(wordData)

      res.status(200).json({
        id,
        message: 'Word successfully added',
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async updateWord(req, res) {
    ValidationChecker.check(req, res)

    try {
      const id = req.params.id
      const wordData = req.body

      await WordDBService.update(id, wordData)

      res.status(200).json({
        id,
        message: 'Word successfully updated',
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async deleteWord(req, res) {
    try {
      const id = req.body.id
      await WordDBService.deleteById(id)
      return res.status(200).json({ id, message: 'Word deleted' })
    } catch (err) {
      res.status(500).json({ error: 'Error deleting word' })
    }
  }
}

export default WordController
