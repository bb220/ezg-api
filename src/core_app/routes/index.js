const express = require("express")
const app = express()

const userRoutes = require('./user')
const roundRoutes = require('./round')
const holeRoutes = require('./hole')

app.use('/user', userRoutes)
app.use('/round', roundRoutes)
app.use('/hole', holeRoutes)

module.exports = app