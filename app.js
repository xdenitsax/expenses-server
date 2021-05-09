const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv/config')

app.use(express.json())

//Import Routes
const routes = require('./routes/routes')

//Middleware -> we can have multiple middlewere

app.use('/', routes)

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
