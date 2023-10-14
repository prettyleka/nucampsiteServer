const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (!favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ "exists": false });
                } else {
                    Favorite.findById(favorite._id)
                        .populate("campsites")
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ "exists": true, "campsites": favorite.campsites });
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(fav => {
                        if (!favorite.campsites.includes(fav._id)) {
                            favorite.campsites.push(fav._id);
                        }
                    })
                    favorite.save()
                        .then(favorite => res.status(200).json(favorite))
                        .catch(err => next(err));
                } else {
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            req.body.forEach(fav => {
                                if (!favorite.campsites.includes(fav._id)) {
                                    favorite.campsites.push(fav._id);
                                }
                            })
                            favorite.save()
                                .then(favorite => res.status(200).json(favorite))
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    res.status(200).json(favorite);
                } else {
                    res.status(200).end("You do not have any favorites to delete.");
                }
            })
            .catch(err => next(err));
    })

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status(403).end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save()
                            .then(favorite => res.status(200).json(favorite));
                    } else {
                        res.status(200).end("Campsite is already a favorite");
                    }
                } else {
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            req.body.forEach(fvrt => {
                                favorite.campsites.push(fvrt._id);
                            })
                            favorite.save()
                                .then(favorite => res.status(200).json(favorite))
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    if (index >= 0) {
                        favorite.campsites.splice(index, 1);
                        favorite.save()
                            .then(res.status(200).json(favorite))
                            .catch(err => next(err));
                    } else {
                        res.status(200).end('You do not have any favorites to delete.');
                    }
                }
            })
            .catch(err => next(err));
    })

module.exports = favoriteRouter;