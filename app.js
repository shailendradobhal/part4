const config = require('./utils/config')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const router = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')

require('express-async-errors')

const mongoUrl = config.MONGODB_URI

logger.info('connecting to', mongoUrl)

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB:`, error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', router)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
