const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

//GETS BACK ALL THE POSTS

router.get('/', async (req, res) => {
  try {
    //Post from models
    const posts = await Post.find()
    res.json(posts)
  } catch (err) {
    res.json({ message: err })
  }
})

//SUBMIT A POST
router.post('/create', async (req, res) => {
  console.log(req.body)
  const post = new Post({
    title: req.body.title,
    amount: req.body.amount,
  })
  try {
    const savedPost = await post.save()
    res.json(savedPost)
  } catch (err) {
    res.status(400).json({ message: err })
  }
})
//SPECIFIC POST
//everything after the http://localhost:3000/post will be the postId
//we can find a specific post by id
router.get('/get/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    res.json(post)
  } catch (err) {
    res.json({ message: err })
  }
})

//Delete a specific post
router.delete('/delete/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId })
    res.json(removedPost)
  } catch (err) {
    res.json({ message: err })
  }
})

//Update  a post
router.patch('/update/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      {
        $set: { title: req.body.title },
      }
    )
    res.json(updatedPost)
  } catch (err) {
    res.json({ message: err })
  }
})
module.exports = router