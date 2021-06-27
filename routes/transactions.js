const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')

// Utils.
const { checkIfTokenIsValid, updateUserToken } = require('../utils/index')

// Get all transactions for the specific user.
router.get('/:userId', async (req, res) => {
  const { token } = req.headers
  const { userId } = req.params
  try {
    const user = await checkIfTokenIsValid(token, userId)
    if (user === 'Invalid token') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (user === 'User does not exist') {
      return res.status(400).json({ message: 'User does not exist' })
    }
    // Update user token.
    updateUserToken(token)
    // Find all transactions for the user.
    const transactions = await Transaction.find({ userId })
    const sortedTransactions = transactions.sort((a, b) => b.date - a.date)
    // Send "success" response.
    res.status(200).json(sortedTransactions)
  } catch (error) {
    res.json({ message: error })
  }
})

// Create a transaction.
router.post('/create', async (req, res) => {
  const { token } = req.headers
  const { title, amount, category, userId, isExpense } = req.body
  const transaction = new Transaction({
    title,
    amount,
    category,
    userId,
    isExpense,
  })
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
    //  Save transaction to the db.
    const savedTransaction = await transaction.save()
    // Send "success" response.
    res.status(201).json(savedTransaction)
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

// Update a transaction.
router.patch('/update', async (req, res) => {
  const { token } = req.headers
  const { transactionId, title, amount, category, userId } = req.body
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
    //  Update transaction in the db.
    if (transactionId && title && amount && category) {
      await Transaction.updateOne(
        { _id: req.body.transactionId },
        {
          $set: { title: req.body.title, amount: req.body.amount, category: req.body.category },
        }
      )
      // Send "success" response.
      res.status(204).send()
      return
    }
    res.status(400).json({ message: 'Missing some or all of content to update' })
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

//Delete a specific transaction
router.delete('/delete/:transactionId', async (req, res) => {
  const { token } = req.headers
  const { userId } = req.body
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
    await Transaction.deleteOne({ _id: req.params.transactionId })
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

module.exports = router
