const Session = require('../models/Session')
const User = require('../models/User')

const checkIfTokenIsValid = async (token, userId) => {
  try {
    const session = await Session.findOne({ token })
    if (!session) {
      // null
      return 'Invalid token'
    }
    // Time difference in minutes between now and when the token was last used.
    const timeDiff = (new Date(Date.now()) - session.lastUsedAt) / 1000 / 60
    if (timeDiff < 10) {
      const user = await User.findOne({ _id: userId })
      if (!user) {
        // null
        return 'User does not exist'
      }
      console.log('user', user)
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
