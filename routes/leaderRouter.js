const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())


//Routes for the root path of the application
leaderRouter.route('/').all(function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'type/plain' });
  next();
});

leaderRouter.route('/').get(function(req, res, next) {
  res.end('Will send all the leaderships to you!');
});

leaderRouter.route('/').post(function(req, res, next) {
  res.end('Will add the leaderships: ' + req.body.name + ' with details: ' + req.body.description);
});

leaderRouter.route('/').put(function(req, res, next) {
    res.statusCode =403;
    res.end('Put operation not supported on /leaders');
  });


leaderRouter.route('/').delete(function(req, res, next) {
  res.end('Deleting all leaderships');
});

// Routes for specific leaderships
leaderRouter.route('/:leadershipsId').all(function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'type/plain' });
  next();
});

leaderRouter.route('/:leadershipsId').get(function(req, res, next) {
  res.end('Will send details of the leadership: ' + req.params.leadershipsId + ' to you!');
});

leaderRouter.route('/:leadershipsId').put(function(req, res, next) {
  res.write('Updating the leadership: '+ req.params.leadershipsId + '.\n');
  res.end('Will update the leadership: ' + req.body.name + ' with details: ' + req.body.description);
});

leaderRouter.route('/:leadershipsId').post(function(req, res, next) {
    res.statusCode = 403;
    res.end('Post operation not supported on /leaders' +req.params.leadershipsId);
  });
  

leaderRouter.route('/:leadershipsId').delete(function(req, res, next) {
    res.end('Deleting leadership: ' + req.params.leadershipsId);
});

module.exports = leaderRouter;