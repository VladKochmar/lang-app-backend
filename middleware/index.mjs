import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import loggerConfig from '../config/logger.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const middleware = app => {
  app.use(cors())
  // Middleware для обробки статичних файлів з директорії public
  app.use(express.static(path.join(__dirname, '../public')))

  // Middleware для логування запитів
  app.use(loggerConfig)

  // Middleware для парсингу JSON запитів
  app.use(express.json())

  // Middleware для парсингу URL-кодованих даних
  app.use(express.urlencoded({ extended: false }))
}

export default middleware
