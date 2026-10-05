const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, itineraryController.addItineraryItem);
router.put('/:id', optionalAuth, itineraryController.updateItineraryItem);
router.delete('/:id', optionalAuth, itineraryController.deleteItineraryItem);

module.exports = router;
