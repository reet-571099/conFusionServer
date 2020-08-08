// This helped clear up things
// http://start.jcolemorrison.com/quick-tip-organizing-routes-in-large-express-4-x-apps/



const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();

// Use the body-parser module to parse data sent
promoRouter.use(bodyParser.json());

//Routes for the root path of the application
promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.find(req.query)
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');            
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;