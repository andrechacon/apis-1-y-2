const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/api/ApiGenresController');

router.get('/api/genres', genresController.list)
      .get('/api/genres/detail/:id', genresController.detail);

module.exports = router;