const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const reviewData = require('./reviewData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define the schema for click events
const clickEventSchema = new mongoose.Schema({
  reviewerName: String,
  reviewText: String,
  thumbnailPath: String,
  shade: String,
  rating: Number,
  attributes: [String],
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String
});

// Create the model
const ClickEvent = mongoose.model('ClickEvent', clickEventSchema);

// API Routes
app.post('/api/click-events', async (req, res) => {
  try {
    const newClickEvent = new ClickEvent({
      ...req.body,
      ipAddress: req.ip
    });
    
    await newClickEvent.save();
    res.status(201).json({ success: true, message: 'Click event recorded' });
  } catch (error) {
    console.error('Error recording click event:', error);
    res.status(500).json({ success: false, message: 'Error recording click event' });
  }
});

// Get all click events (for testing purposes)
app.get('/api/click-events', async (req, res) => {
  try {
    const events = await ClickEvent.find().sort({ timestamp: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching click events:', error);
    res.status(500).json({ success: false, message: 'Error fetching click events' });
  }
});

// Get review data
app.get('/api/reviews', (req, res) => {
  res.json(reviewData);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});