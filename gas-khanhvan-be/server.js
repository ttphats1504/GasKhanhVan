const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/menu', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Define MenuItem schema and model
const menuItemSchema = new mongoose.Schema({
  label: String,
  key: String,
  icon: String,
  children: Array,
  disabled: Boolean,
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

// CRUD API routes

// Create a menu item
app.post('/api/menu', async (req, res) => {
  const newItem = new MenuItem(req.body)
  try {
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Update a menu item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json(updatedItem)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

// Delete a menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id)
    res.json({message: 'Menu item deleted'})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
