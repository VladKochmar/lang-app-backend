import pool from '../../../db/connectDB.mjs'

class MySQLCRUDManager {
  /**
   * Class constructor
   * @param {string} tableName - The name of the table to work with
   * @param {string} primaryKey - The primary key of the table
   */
  constructor(tableName, primaryKey) {
    this.tableName = tableName
    this.primaryKey = primaryKey
  }

  /**
   * Find multiple records with filters, pagination, and sorting
   * @param {string[]} fields - Fields for selection (default `*`)
   * @param {object[]} joins - An array of objects that describe a table join (JOIN)
   * @param {object} filters - An object with filters
   * @param {number|null} limit - Number of records per page (default `10`)
   * @param {number|null} offset - Offset for pagination (default `0`)
   * @returns {object} - An object with documents and the total number
   */
  async findMany(fields = ['*'], joins = [], filters = {}, limit = null, offset = null) {
    const joinClause = joins.map(({ table, on }) => `JOIN ${table} ON ${on}`).join(' ')

    let whereConditions = []
    let filterValues = []

    if (filters.letter) {
      whereConditions.push(`base_word LIKE ?`)
      filterValues.push(`${filters.letter}%`)
      delete filters.letter
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        whereConditions.push(`${key} IN (${value.map(() => '?').join(', ')})`)
        filterValues.push(...value)
      } else {
        whereConditions.push(`${key} = ?`)
        filterValues.push(value)
      }
    })

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const limitClause = limit !== null ? 'LIMIT ?' : ''
    const offsetClause = offset !== null ? 'OFFSET ?' : ''

    const sql = `
      SELECT ${fields.join(', ')}
      FROM ${this.tableName}
      ${joinClause}
      ${whereClause}
      ${limitClause}
      ${offsetClause}
    `

    if (limit !== null && offset !== null) {
      filterValues.push(limit, offset)
    }

    const [rows] = await pool.execute(sql, filterValues)

    return { documents: rows }
  }

  /**
   * Find a single record by ID
   * @param {number} id - The ID of the record to find
   * @param {string[]} fields - The fields to select (default `*`)
   * @param {object[]} joins - An array of objects that describe a table join (JOIN)
   * @returns {object|null} - The found record or `null`
   */
  async findById(id, fields = ['*'], joins = []) {
    const joinClause = joins.map(({ table, on }) => `JOIN ${table} ON ${on}`).join(' ')

    const sql = `
    SELECT ${fields.join(', ')}
    FROM ${this.tableName}
    ${joinClause}
    WHERE ${this.primaryKey} = ?
    LIMIT 1
    `

    const [rows] = await pool.execute(sql, [id])
    return rows[0] || null
  }

  /**
   * Create a new record
   * @param {object} data - An object with data to create a record
   * @returns {number} - ID of the created record
   */
  async create(data) {
    const fields = Object.keys(data)
    const placeholders = fields.map(() => '?').join(', ')
    const values = Object.values(data)

    const sql = `
    INSERT INTO ${this.tableName} (${fields.join(', ')})
    VALUES (${placeholders})
    `

    const [result] = await pool.execute(sql, values)
    return result.insertId
  }

  /**
   * Update a record by ID
   * @param {number} id - ID of the record to be updated
   * @param {object} data - An object with new data
   * @returns {boolean} - Whether the update was successful
   */
  async update(id, data) {
    const updates = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]

    const sql = `
    UPDATE ${this.tableName}
    SET ${updates}
    WHERE ${this.primaryKey} = ?
    `

    const [result] = await pool.execute(sql, values)
    return result.affectedRows > 0
  }

  /**
   * Delete a record by ID
   * @param {number} id - ID of the record to be deleted.
   * @returns {boolean} - Whether the deletion was successful.
   */
  async deleteById(id) {
    const sql = `
    DELETE FROM ${this.tableName}
    WHERE ${this.primaryKey} = ?
    `

    const [result] = await pool.execute(sql, [id])
    return result.affectedRows > 0
  }
}

export default MySQLCRUDManager
