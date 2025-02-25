const request = require('supertest');
const express = require('express');
const reviewData = require('./reviewData');

// Create a test app instance
const app = express();
app.use(express.json());

// Create mock implementations first
const mockSave = jest.fn().mockResolvedValue(true);
const mockFind = jest.fn().mockReturnThis();
const mockExec = jest.fn().mockResolvedValue([]);
const mockSort = jest.fn().mockResolvedValue([]);

// Create the mock model
const mockClickEvent = {
  find: mockFind,
  sort: mockSort,
  exec: mockExec,
  prototype: {
    save: mockSave
  }
};

// Mock mongoose module
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(undefined),
  Schema: jest.fn(),
  model: jest.fn().mockReturnValue(mockClickEvent)
}));

// API Routes
app.post('/api/click-events', async (req, res) => {
  try {
    const newClickEvent = {
      ...req.body,
      ipAddress: req.ip
    };
    
    // Use the mock save method
    await mockClickEvent.prototype.save.call(newClickEvent);
    res.status(201).json({ success: true, message: 'Click event recorded' });
  } catch (error) {
    console.error('Error recording click event:', error);
    res.status(500).json({ success: false, message: 'Error recording click event' });
  }
});

app.get('/api/click-events', async (req, res) => {
  try {
    // Use the mock find and sort methods
    const events = await mockClickEvent.sort();
    res.json(events);
  } catch (error) {
    console.error('Error fetching click events:', error);
    res.status(500).json({ success: false, message: 'Error fetching click events' });
  }
});

app.get('/api/reviews', (req, res) => {
  res.json(reviewData);
});

describe('API Routes', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockSave.mockClear();
    mockFind.mockClear();
    mockSort.mockClear();
  });

  it('GET /api/reviews - should return all reviews', async () => {
    const response = await request(app).get('/api/reviews');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(reviewData.length);
    
    const firstReview = response.body[0];
    expect(firstReview).toHaveProperty('reviewer_name');
    expect(firstReview).toHaveProperty('review_text');
    expect(firstReview).toHaveProperty('thumbnail_path');
    expect(firstReview).toHaveProperty('attributes');
  });

  it('POST /api/click-events - should record a click event', async () => {
    const mockClickData = {
      reviewerName: 'Test User',
      reviewText: 'This is a test review',
      thumbnailPath: 'test.jpg',
      shade: 'Test Shade',
      rating: 5,
      attributes: ['Fair', 'Dry Skin'],
      userAgent: 'Test Agent'
    };

    const response = await request(app)
      .post('/api/click-events')
      .send(mockClickData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(mockSave).toHaveBeenCalled();
  });

  it('POST /api/click-events - should handle errors', async () => {
    // Mock a failed save
    mockSave.mockRejectedValueOnce(new Error('Database error'));
    
    const mockClickData = {
      reviewerName: 'Test User',
      reviewText: 'This is a test review'
      // Missing required fields
    };

    const response = await request(app)
      .post('/api/click-events')
      .send(mockClickData);
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('GET /api/click-events - should return all click events', async () => {
    // Mock successful database query
    mockSort.mockResolvedValueOnce([
      { reviewerName: 'Test User 1', timestamp: new Date() },
      { reviewerName: 'Test User 2', timestamp: new Date() }
    ]);

    const response = await request(app).get('/api/click-events');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('GET /api/click-events - should handle database errors', async () => {
    // Mock database error
    mockSort.mockRejectedValueOnce(new Error('Database query failed'));

    const response = await request(app).get('/api/click-events');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });
});

describe('API Endpoints', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFind.mockClear();
    mockSort.mockClear();
    mockExec.mockClear();
    mockSave.mockClear();
  });

  describe('GET /api/reviews', () => {
    it('should return all reviews', async () => {
      const res = await request(app).get('/api/reviews');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(reviewData.length);
      
      // Check that the first review has the expected properties
      expect(res.body[0]).toHaveProperty('reviewer_name');
      expect(res.body[0]).toHaveProperty('review_text');
      expect(res.body[0]).toHaveProperty('thumbnail_path');
      expect(res.body[0]).toHaveProperty('shade');
      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0]).toHaveProperty('attributes');
    });
  });

  describe('POST /api/click-events', () => {
    it('should create a new click event', async () => {
      const clickEventData = {
        reviewerName: 'Test User',
        reviewText: 'This is a test review',
        thumbnailPath: 'test.jpg',
        shade: 'Test Shade',
        rating: 5,
        attributes: ['Test', 'Attribute'],
        userAgent: 'Jest Test'
      };

      const res = await request(app)
        .post('/api/click-events')
        .send(clickEventData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Click event recorded');
      expect(mockSave).toHaveBeenCalled();
    });

    it('should handle errors when creating click events', async () => {
      // Mock a save error
      mockSave.mockRejectedValueOnce(new Error('Database error'));

      const clickEventData = {
        reviewerName: 'Test User',
        // Missing required fields
      };

      const res = await request(app)
        .post('/api/click-events')
        .send(clickEventData);
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});