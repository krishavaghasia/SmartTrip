const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.post('/', optionalAuth, tripController.createTrip);
router.get('/', optionalAuth, tripController.getTrips);
router.get('/stats', optionalAuth, tripController.getStats);
router.get('/:id', optionalAuth, tripController.getTripById);
router.put('/:id', optionalAuth, tripController.updateTrip);
router.delete('/:id', optionalAuth, tripController.deleteTrip);

module.exports = router;
