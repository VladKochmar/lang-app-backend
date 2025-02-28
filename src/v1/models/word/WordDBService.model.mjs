import pool from '../../../../db/connectDB.mjs'
import MySQLCRUDManager from '../MySQLCRUDManager.mjs'

class WordDBService extends MySQLCRUDManager {
  constructor() {
    super('words', 'id')
  }

  /**
   * Find a total number of words
   * @param {object} filters - An object with filters
   * @returns {number} - Total number of words
   */
  async getTotalCount(filters = {}) {
    const filterKeys = Object.keys(filters)
    const whereClause = filterKeys.length ? `WHERE ${filterKeys.map(key => `${key} = ?`).join(' AND ')}` : ''

    const sql = `
      SELECT COUNT(*) AS total
      FROM ${this.tableName}
      ${whereClause}
    `

    const filterValues = Object.values(filters)
    const [countResult] = await pool.execute(sql, filterValues)
    return countResult[0].total
  }
}

export default new WordDBService()
