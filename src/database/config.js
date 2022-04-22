const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
    console.log('MongoDB has connected succesfully')
})

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB has reconnected')
})

mongoose.connection.on('error', error => {
    console.log('MongoDB connection has an error', error)
    mongoose.disconnect()
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection is disconnected')
})
