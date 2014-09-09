// ******************************************
// Main route handler.
// __________________________________________

var User       		   = require('../models/user');
var Goal       		   = require('../models/goal');

// Get the authorization variables.
var configAuth       = require('../../config/auth');
var emailer          = require('./helpers/route_helper');
var money            = require('./helpers/money_helper');



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

              // Format the currency amounts.
              for (var i = 0; i < results.length; i++) {

                  var result             = results[i];

                  result.goalAmount      = money.format(result.goalAmount);
                  result.goalAmountSaved = money.format(result.goalAmountSaved);
                  result.dollarsPerDay   = money.format(result.dollarsPerDay);

              }

              // Add the results to the response.
              req.user.results = results;
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
      var user              = req.params.user;
			var name              = req.params.name;
			var amount            = req.params.amount;
			var saved             = req.params.saved;
			var date              = req.params.date;
      date                  = date.replace(/slash/g, '/');
			var alerts            = req.params.alerts;
      var amountLeftToSave  = amount - saved;
      var id                = req.params.id;

      // Calculate the days between right now and the goal date.
      var target            = new Date(date);
      var today             = new Date();
      var differenceInTime  = Math.abs(today.getTime() - target.getTime());
      var differenceInDays  = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      // Colculate the dollars per day required to meet goal.
      var dollarsPerDay     = (amountLeftToSave / differenceInDays).toFixed(2);

      var newGoal = {
          goalUser: 				user,
          goalName: 				name,
          goalAmount: 			amount,
          goalAmountSaved: 	saved,
          goalTargetDate: 	date,
          dollarsPerDay:    dollarsPerDay,
          emailAlerts: 			alerts
      };

      Goal.createNew(newGoal, function(goal) {
          res.json(goal);
      });
	});

  app.post('/updategoal/:id/:name/:amount/:saved/:date/:alerts', function(req, res) {

      var updates = {
          id: req.params.id,
          name: req.params.name,
          amount: req.params.amount,
          saved: req.params.saved,
          date: req.params.date,
          alerts: req.params.alerts
      };

      Goal.update(updates.id, updates, function(goal) {
          res.json(goal);
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
