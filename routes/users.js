const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const Session = require('../models/Session')

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.json({ message: err })
  }
})

// Get single user.
// everything after the http://localhost:3000/post will be the postId
// we can find a specific post by id
router.get('/:userId', async (req, res) => {
  console.log('req params', req.params.userId)
  try {
    // const { firstName, lastName } = await User.findOne({ id: req.params.userId })
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) {
      res.json({ message: 'User does not exist' })
      return
    }
    res.json({ firstName: user.firstName, lastName: user.lastName })
  } catch (err) {
    res.json({ message: err })
  }
})

// Create user
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

//Login
router.post('/login', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username })
  if (existingUser !== null) {
    if (existingUser.password === req.body.password) {
      const token = uuidv4()
      // Expires in half an hour from now
      const expiresAt = new Date(new Date().getTime() + 1800000)
      const session = new Session({
        token,
        userId: existingUser._id,
        expiresAt,
      })
      await session.save()
      res.status(200).json({ token: `Bearer ${token}`, userId: existingUser._id })
      return
    }
    res.status(401).json({ message: 'Username or password is incorrect!' })
    return
  }
  res.status(401).json({ message: 'Username or password is incorrect!' })
})

// SPECIFIC POST
// everything after the http://localhost:3000/post will be the postId
// we can find a specific post by id
// router.get('/get/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//     res.json(post)
//   } catch (err) {
//     res.json({ message: err })
//   }
// })

//Delete a specific post
// router.delete('/delete/:postId', async (req, res) => {
//   try {
//     const removedPost = await Post.remove({ _id: req.params.postId })
//     res.json(removedPost)
//   } catch (err) {
//     res.json({ message: err })
//   }
// })

//Update  a post
// router.patch('/update/:postId', async (req, res) => {
//   try {
//     const updatedPost = await Post.updateOne(
//       { _id: req.params.postId },
//       {
//         $set: { title: req.body.title },
//       }
//     )
//     res.json(updatedPost)
//   } catch (err) {
//     res.json({ message: err })
//   }
// })
module.exports = router
