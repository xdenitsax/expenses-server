const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')
const User = require('../models/User')

// Get all transactions for the specific user.
router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    // Get transactions.
    const user = await User.findOne({ _id: userId })
    if (!user) {
      res.status(400).json({ message: 'User does not exist' })
      return
    }
    const transactions = await Transaction.find({ userId })
    const sortedTransactions = transactions.sort((a, b) => b.date - a.date)
    res.status(200).json(sortedTransactions)
  } catch (error) {
    res.json({ message: error })
  }
})

// Create a transaction.
router.post('/create', async (req, res) => {
  const { title, amount, category, userId, isExpense } = req.body
  const transaction = new Transaction({
    title,
    amount,
    category,
    userId,
    isExpense,
  })
  try {
    const user = await User.findOne({ _id: userId })

    if (!user) {
      res.status(400).json({ message: 'User does not exist' })
      return
    }
    const savedTransaction = await transaction.save()
    res.status(201).json(savedTransaction)
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

// Update a transaction.
router.patch('/update', async (req, res) => {
  const { transactionId, title, amount, category } = req.body
  try {
    if (transactionId && title && amount && category) {
      const updatedTransaction = await Transaction.updateOne(
        { _id: req.body.transactionId },
        {
          $set: { title: req.body.title, amount: req.body.amount, category: req.body.category },
        }
      )

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
  console.log(req)
  try {
    const deletedTransaction = await Transaction.deleteOne({ _id: req.params.transactionId })
    console.log(deletedTransaction)
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

module.exports = router
