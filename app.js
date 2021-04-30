const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
require('dotenv/config')

app.use(bodyParser.json())

//Import Routes

const postRoute = require('./routes/PostTransaction')

//Middleware -> we can have multiple middlewere

app.use('/postTransaction', postRoute)

// ROUTS
app.get('/', (req, res) => {
  res.send('We are on home')
})

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },

  () => console.log('Conected TO DBBBBB')
)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
