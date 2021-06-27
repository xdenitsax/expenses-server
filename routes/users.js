const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const Session = require('../models/Session')

// Utils.
const { checkIfTokenIsValid, updateUserToken } = require('../utils/index')

// Get all users.
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.json({ message: err })
  }
})

// Get single user.
router.get('/:userId', async (req, res) => {
  const { token } = req.headers
  const { userId } = req.params
  try {
    const user = await checkIfTokenIsValid(token, userId)
    if (user === 'Invalid token') {
      res.status(401).json({ message: 'Invalid token' })
      return
    }
    if (user === 'User does not exist') {
      res.status(400).json({ message: 'User does not exist' })
      return
    }
    // Update user token.
    updateUserToken(token)
    res.status(200).json({ firstName: user.firstName, lastName: user.lastName })
  } catch (error) {
    res.json({ message: error })
  }
})

// Create user.
router.post('/register', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username })
  if (existingUser === null) {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
    })
    try {
      await user.save()
      res.status(201).send()
    } catch (error) {
      res.status(400).json({ message: error._message })
    }
  } else {
    res.status(409).json({ message: 'Username is taken' })
  }
})

// Login.
router.post('/login', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username })
  if (existingUser !== null) {
    if (existingUser.password === req.body.password) {
      const token = `Bearer ${uuidv4()}`
      const lastUsedAt = new Date(Date.now())
      const session = new Session({
        token,
        userId: existingUser._id,
        lastUsedAt,
      })
      await session.save()
      res.status(200).json({ token, userId: existingUser._id })
      return
    }
    res.status(401).json({ message: 'Username or password is incorrect!' })
    return
  }
  res.status(401).json({ message: 'Username or password is incorrect!' })
})

// Delete all sessions.
router.delete('/delete-all-sessions', async (req, res) => {
  if (process.env.SESSION_SECRET_KEY === req.body.key) {
    try {
      Session.collection.drop()
      res.status(200).send('Deleted all sessions')
    } catch (error) {
      res.status(400).send('DB error')
    }
    res.status(404).send()
  }
})

module.exports = router
