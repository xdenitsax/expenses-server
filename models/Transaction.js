const mongoose = require('mongoose')

const TransactionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Transaction', TransactionSchema)
