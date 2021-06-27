const Session = require('../models/Session')
const User = require('../models/User')

const checkIfTokenIsValid = async (token, userId) => {
  try {
    const session = await Session.findOne({ token })
    if (!session) {
      return 'Invalid token'
    }
    const timeDiff = (new Date(Date.now()) - session.lastUsedAt) / 1000 / 60
    if (timeDiff < 10) {
      const user = await User.findOne({ _id: userId })
      if (!user) {
        return 'User does not exist'
      }
      return user
    }
    return 'Invalid token'
  } catch (error) {
    return error
  }
}

const updateUserToken = async (token) => {
  let lastUsedAt = new Date(Date.now())
  try {
    await Session.findOneAndUpdate({ token }, { lastUsedAt })
  } catch (error) {
    console.log(error)
    return
  }
}

module.exports = { checkIfTokenIsValid, updateUserToken }
