const express = require("express")
const app = express()

const userRoutes = require('./user')
const roundRoutes = require('./round')
const holeRoutes = require('./hole')
const courseRoutes=require('./course')
const courseHoleRoutes=require('./course_hole')

app.use('/user', userRoutes)
app.use('/round', roundRoutes)
app.use('/hole', holeRoutes)
app.use('/course', courseRoutes)
app.use('/course_hole', courseHoleRoutes)

module.exports = app