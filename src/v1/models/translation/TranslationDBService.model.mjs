import MySQLCRUDManager from '../MySQLCRUDManager.mjs'

class TranslationDBSerive extends MySQLCRUDManager {
  constructor() {
    super('translations', 'id')
  }
}

export default new TranslationDBSerive()
