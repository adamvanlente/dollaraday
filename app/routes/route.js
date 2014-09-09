// ******************************************
// Main route handler.
// __________________________________________

var User       		   = require('../models/user');
var Goal       		   = require('../models/goal');

// Get the authorization variables.
var configAuth       = require('../../config/auth');
var configAuth       = require('../../config/auth');
var emailer          = require('./helpers/email_helper');
var numbers          = require('./helpers/numbers_helper');


// Export main routes to app.
module.exports = function(app, passport) {


 // ====================================
 // ====================================
 // HOME PAGE ROUTE ====================
 // ====================================
 // ====================================
  app.get('/', function(req, res) {

			// If no user is found, show basic intro page.  Else show user's goals.
      if (!req.user) {
  				res.render('index.jade');
			} else {

          var sortParams = {sort: {goalName: 1}};
          // var sortParams = {sort: {goalName: -1}, skip: start, limit: 20};
          Goal.findMany(req.user.id, sortParams, function(results) {

              // Add the results to the user object in the response.
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
      var dollarsPerDay     = numbers.getDollarsPerDay(date, amountLeftToSave);

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

  // ====================================
  // ====================================
  // UPDATE EXISTING GOAL (post only) ===
  // ====================================
  // ====================================
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
