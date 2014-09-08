// ******************************************
// Main route handler.
// __________________________________________

var Goal       		   = require('../models/goal');

module.exports = function(app, passport) {

	// HOME
	app.get('/', function(req, res) {

			if (!req.user) {
  				res.render('index.jade');
			} else {
					Goal.findMany(req.user.id, function(results) {
							req.user.results = results;
							res.render('index.jade', { user : req.user });
					})
			}
	});

	// POST NEW GOAL
	app.post('/newgoal', function(req, res) {

			var targetDate = req.body["dad-form-goal-target-date"];
			var goalAmount = req.body["dad-form-goal-target-amount"];
			var goalAmountSaved = req.body["dad-form-goal-amount-saved"];
			var amountLeftToSave = goalAmount - goalAmountSaved;

			var target = new Date(targetDate);
			var today  = new Date();

			var differenceInTime = Math.abs(today.getTime() - target.getTime());
			var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

			var dollarsPerDay = (amountLeftToSave / differenceInDays).toFixed(2);

			var newGoal = {
					goalUser: 				req.body["dad-form-user"],
					goalName: 				req.body["dad-form-goal-name"],
					goalAmount: 			goalAmount,
					goalAmountSaved: 	goalAmountSaved,
					goalTargetDate: 	targetDate,
					dollarsPerDay:    dollarsPerDay,
					emailAlerts: 			req.body["dad-form-email-alerts"]
			};

			Goal.createNew(newGoal, function(doc) {
					res.redirect('/');
			})
	});

};
