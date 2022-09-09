const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const fetch = require('node-fetch');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.status(200).json({
                    meta:{
                        status: 200,
                        total: movies.length,
                        url: 'api/movies'
                    },
                    data: movies
                })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                res.status(200).json({
                    meta:{
                        status: 200,
                        url: `api/genres/detail/${req.params.id}`
                    },
                    data: movie
                })
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.status(200).json({
                    meta:{
                        status: 200,
                        total: movies.length,
                        url: 'api/movies'
                    },
                    data: movies
                })
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.status(200).json({
                    meta:{
                        status: 200,
                        total: movies.length,
                        url: 'api/movies'
                    },
                    data: movies
                })
            });
    },
    create: function (req,res) {
        
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then((movie)=> {
            return res.status(201).json({
                meta:{
                    status: 201,
                    url: `api/movies/detail/${movie.id}`
                },
                data:movie
            })
        })
        .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then((result)=> {
            if(result[0] === 1){

                res.status(201).json({
                    meta:{
                        status: 201,
                        url: `api/movies/update/${req.params.id}`
                    },
                    data:{
                        id: req.params.id,
                        updated: 'ok'
                    }
                })
            } else {
                res.json({
                    updated: 'error'
                })
            }
        })
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then((movie)=> {
            if(result[0] === 1){

                res.status(201).json({
                    meta:{
                        status: 201,
                        url: `api/movies/update/${req.params.id}`
                    },
                    data:{
                        id: req.params.id,
                        deleted: 'ok'
                    }
                })
            } else {
                res.json({
                    deleted: 'error'
                })
            }
        })
        .catch(error => res.send(error)) 
    },
    search:async (req,res)=>{
        const result = await fetch(`http://www.omdbapi.com/?apikey=2841aff6&s=${req.query.title}`);
        const data = await result.json()
        
        res.json({
            meta:{
                searchByDMB: 'ok',
                status: 200
            },
            data:{
                movies: data.Search
            }
        })
    }
}

module.exports = moviesController;