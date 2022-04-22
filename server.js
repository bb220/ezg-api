const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require("cors")
require('dotenv').config()
require('./src/database/config')

const appRoutes = require('./src/appRoutes')
const { routesNotFound, globalErrorHandler } = require('./src/middleware/globalException')

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(logger("dev"))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(mongoSanitize())


app.use('/api', appRoutes)
app.use(routesNotFound)
app.use(globalErrorHandler)

app.listen(PORT, () =>
  console.log(`Server running at port :: ${PORT}`))


