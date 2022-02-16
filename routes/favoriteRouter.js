const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { findOneAndDelete, findOne } = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user.ref')
    .populate('campsites.ref')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            const favArray = favorite.campsites
            const reqArray = req.body.campsites

            reqArray.forEach((campsite) => {
                if (! favArray.includes(campsite)) {
                    favArray.push(campsite);
                } else {
                    console.log(`this campsite ${campsite} is already in favorites.`)
                };
            })
        } else {
            Favorite.create(req.body)
            favorite.save()
            .then(favorite => {
                console.log('Favorites Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    console.log('This operation is not supported.');
    res.statusCode = 403;
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete(
        { user: req.user._id }
    )
    .then(favorite => {
        res.statusCode = 200;
        
        if (favorite) {
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.')
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    console.log('This operation is not supported.');
    res.statusCode = 403;
    next();
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            const favArray = favorite.campsites
            const reqArray = req.body.campsites

            reqArray.forEach((campsite) => {
                if (! favArray.includes(campsite)) {
                    favArray.push(campsite);
                } else {
                    console.log(`this campsite ${campsite} is already in favorites.`)
                };
            })
        } else {
            Favorite.create(req.body)
            favorite.save()
            .then(favorite => {
                console.log('Favorites Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    console.log('This operation is not supported.');
    res.statusCode = 403;
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne(
        {user: req.user._id}
    )
    .then(favorite => {
        const reqArray = req.body.campsites

        if (favorite) {
            reqArray.filter(campsite => campsite.campsiteId === req.params.campsiteId);
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        } else {
            console.log('there are no favorites to delete')
            res.setHeader('Content-Type', 'application/json');
        }
    })
});


module.exports = favoriteRouter;