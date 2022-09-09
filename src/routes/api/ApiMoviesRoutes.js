const express = require('express');
const router = express.Router();
const ApiMoviesController = require('../../controllers/api/ApiMoviesController');

router.get('/api/movies', ApiMoviesController.list)
    .get('/api/movies/new', ApiMoviesController.new)
    .get('/api/movies/recommended', ApiMoviesController.recomended)
    .get('/api/movies/detail/:id', ApiMoviesController.detail)
    .get('/api/movies/search',ApiMoviesController.search)
    //Rutas exigidas para la creación del CRUD
    .post('/api/movies/create', ApiMoviesController.create)
    .put('/api/movies/update/:id', ApiMoviesController.update)
    .delete('/api/movies/delete/:id', ApiMoviesController.destroy);

module.exports = router;