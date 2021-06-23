const mongoose = require('mongoose')

const Session = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  lastUsedAt: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('Session', Session)
