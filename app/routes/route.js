// ******************************************
// Main route handler.
// __________________________________________

var User       		   = require('../models/user');
var Goal       		   = require('../models/goal');

// Get the authorization variables.
var configAuth       = require('../../config/auth');

var emailer          = require('./helpers/route_helper');



module.exports = function(app, passport) {


 // ====================================
 // ====================================
 // HOME PAGE ROUTE ====================
 // ====================================
 // ====================================
  app.get('/', function(req, res) {

			if (!req.user) {
  				res.render('index.jade');
			} else {
					Goal.findMany(req.user.id, function(results) {
							req.user.results = results;
              // Iterate and FORMAT MONEY
							res.render('index.jade', { user : req.user });
					})
			}
	});


  // ====================================
  // ====================================
  // CREATE A NEW GOAL (post only) ======
  // ====================================
  // ====================================
  app.post('/goal/:user/:name/:amount/:saved/:date/:alerts/:userEmail',
      function(req, res) {

			// Get the params from the request.
      var user = req.params.user;
			var name = req.params.name;
			var amount = req.params.amount;
			var saved = req.params.saved;
			var date = req.params.date;
      date = date.replace(/slash/g, '/');
			var alerts = req.params.alerts;
      var amountLeftToSave = amount - saved;

      // Calculate the days between right now and the goal date.
      var target = new Date(date);
      var today  = new Date();
      var differenceInTime = Math.abs(today.getTime() - target.getTime());
      var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      // Colculate the dollars per day required to meet goal.
      var dollarsPerDay = (amountLeftToSave / differenceInDays).toFixed(2);

      var newGoal = {
          goalUser: 				user,
          goalName: 				name,
          goalAmount: 			amount,
          goalAmountSaved: 	saved,
          goalTargetDate: 	date,
          dollarsPerDay:    dollarsPerDay,
          emailAlerts: 			alerts
      };

      Goal.createNew(newGoal, function(doc) {
          res.json(doc);
      });



	});

  // ====================================
  // ====================================
  // SEND USERS AN EMAIL ================
  // ====================================
  // ====================================
	app.get('/updater/emailUsers', function(req, res) {
      emailer.start();
      res.json({ msg: 'emailing folks' });
	});

};
