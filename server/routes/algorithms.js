const express = require('express');
const router = express.Router();
const algorithmController = require('../controllers/algorithmController');

router.post('/generate-itinerary', algorithmController.generateItineraryPlan);
router.post('/optimize-route', algorithmController.optimizeRouteEndpoint);
router.post('/group-preferences', algorithmController.calculateGroupPreferencesEndpoint);
router.get('/recommendations', algorithmController.getRecommendationsEndpoint);
router.post('/budget-optimize', algorithmController.analyzeBudgetEndpoint);

module.exports = router;
