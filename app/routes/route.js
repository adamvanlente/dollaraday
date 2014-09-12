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
      res.render('index.jade', { user : req.user });
	});


  app.get('/userGoals/:id/:sortParam', function(req, res) {

      var id                = req.params.id;
      var sortParam         = req.params.sortParam;
      var sortParams        = {sort: {goalName: 1}};
      if (sortParam == 'goalName') {
          sortParams        = {sort: {goalName: 1}};
      }
      // var sortParams = {sort: {goalName: -1}, skip: start, limit: 20};
      Goal.findMany(id, sortParams, function(results) {

          // Add the results to the user object in the response.
          res.json(results)

      })
  });


  // ====================================
  // ====================================
  // CREATE A NEW GOAL ==================
  // ====================================
  // ====================================
  app.get('/goal/:user/:name/:amount/:saved/:date/:alerts/:userEmail',
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
  // UPDATE EXISTING GOAL ===============
  // ====================================
  // ====================================
  app.get('/updategoal/:id/:name/:amount/:saved/:date/:alerts', function(req, res) {

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
  // REMOVE A GOAL ======================
  // ====================================
  // ====================================
  app.get('/removeGoal/:id', function(req, res){
      var id = req.params.id;
      Goal.remove(id, function(result) {
          res.json(result);
      })
  })

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
