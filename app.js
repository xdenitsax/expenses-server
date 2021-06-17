const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
require('dotenv/config')

app.use(express.json())

//Import Routes
const transactions = require('./routes/transactions')
const users = require('./routes/users')
//Middleware -> we can have multiple middlewere
// Prevents CORS errors.
app.use(cors())
app.use('/transactions', transactions)
app.use('/users', users)

// ROUTS
app.get('/', (req, res) => {
  res.send('We are on home')
})

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },

  () => console.log('Conected to Database')
)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
