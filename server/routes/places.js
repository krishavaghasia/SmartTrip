const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlaceById);

module.exports = router;
