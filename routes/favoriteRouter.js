const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');

var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({ user:req.user._id})
    .then((favorites) => {
        if(!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type' ,'application/json');
            return res.json({"exists": false,"favorites": favorites});
        }
        else {
            if(favorites.dishes.indexOf(req.param.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type' ,'application/json');
                return res.json({"exists": false,"favorites": favorites});    
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type' ,'application/json');
                return res.json({"exists": true,"favorites": favorites});
    
            }
        }
    },(err) => next(err))
    .catch((err) =>next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const authenticate = require('../authenticate');
// const Favorites = require('../models/favorite');
// const Dishes = require('../models/dishes');
// const cors = require('./cors');

// const favoriteRouter = express.Router();
// favoriteRouter.use(bodyParser.json());

// favoriteRouter.route('/')
//     .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//     .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         Favorites.find({ user: req.user._id })
//             .populate('user')
//             .populate('dishes')
//             .then((favorite) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorite[0]);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//     })
//     .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         Favorites.find({ user: req.user._id })
//             .then((favorite) => {
//                 if (favorite.length == 0) {
//                     var favorite = new Favorites();
//                     favorite.user = req.user._id;
//                     for (i = 0; i < req.body.length; i++) {
//                         favorite.dishes.push(req.body[i]);
//                     }
//                     favorite.save()
//                         .then((favorite) => {
//                             Favorites.findById(favorite._id)
//                             .populate('user')
//                             .populate('dishes')
//                             .then((favorite) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorite);
//                             })
                            
//                         }, (err) => next(err))                        
//                 } else {
//                     console.log(req.body);
//                     for (i = 0; i < req.body.length; i++) {
//                         console.log("Body message is "+ req.body[i]._id);
//                         if (!favorite[0].dishes.includes(req.body[i]._id)) {
//                             favorite[0].dishes.push(req.body[i]);
//                         }
//                     }
//                     favorite[0].save()
//                     .then((favorite) => {
//                         Favorites.findById(favorite._id)
//                             .populate('user')
//                             .populate('dishes')
//                             .then((favorite) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                             })
//                     }, (err) => next(err))

//                 }

//             }, (err) => next(err))
//             .catch((err) => next(err));
//     })
//     .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         res.statusCode = 403;
//         res.end('PUT operation not supported on /favorites');
//     })
//     .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         Favorites.remove({ user: req.user._id })
//             .then((resp) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(resp);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//     });

// favoriteRouter.route('/:dishId')
//     .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//     .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         res.statusCode = 403;
//         res.end('Get operation not supported on /favorites/:dishId');
//     })
//     .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

//         Favorites.find({ user: req.user._id })
//             .then((favorite) => {
//                 if (favorite.length == 0) {
//                     var favorite = new Favorites();
//                     favorite.user = req.user._id;
//                     favorite.dishes.push(req.params.dishId);
//                     favorite.save()
//                     .then((favorite) => {
//                         Favorites.findById(favorite._id)
//                         .populate('user')
//                         .populate('dishes')
//                         .then((favorite) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                         })
//                         }, (err) => next(err))                        
//                 } else {
//                     if (favorite[0].dishes.includes(req.params.dishId)) {
//                         err = new Error('Dish ' + req.params.dishId + ' already in favorites');
//                         err.statusCode = 403;
//                         return next(err);
//                     } else {
//                         favorite[0].dishes.push(req.params.dishId);
//                         favorite[0].save()
//                         .then((favorite) => {
//                             Favorites.findById(favorite._id)
//                             .populate('user')
//                             .populate('dishes')
//                             .then((favorite) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorite);
//                             })
//                             }, (err) => next(err))
//                     }
//                 }

//             }, (err) => next(err))
//             .catch((err) => next(err));
//     })

//     .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         res.statusCode = 403;
//         res.end('Put operation not supported on /favorites/:dishId');
//     })

//     .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//         Favorites.find({ user: req.user._id })
//             .then((favorite) => {
//                 if (favorite.length == 0) {
//                     err = new Error('No favroites for user ' + req.params.user._id);
//                     err.statusCode = 403;
//                     return next(err);
//                 } else {
//                     if (favorite[0].dishes.includes(req.params.dishId)) {
//                         index = favorite[0].dishes.indexOf(req.params.dishId);
//                         favorite[0].dishes.splice(index,1);
//                         favorite[0].save()
//                         .then((favorite) => {
//                             Favorites.findById(favorite._id)
//                             .populate('user')
//                             .populate('dishes')
//                             .then((favorite) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorite);
//                             });
//                             }, (err) => next(err))
//                     } else {
//                         err = new Error('Dish ' + req.params.dishId + ' is not in favorites');
//                         err.statusCode = 403;
//                         return next(err);
//                     }
//                 }

//             }, (err) => next(err))
//             .catch((err) => next(err));
//     });

//module.exports = favoriteRouter;