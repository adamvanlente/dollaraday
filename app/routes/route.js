// ******************************************
// Main route handler.
// __________________________________________

module.exports = function(app, passport) {

	// HOME
	app.get('/', function(req, res) {

			// Render a response to Json
			res.json({ 'test': true});

			// Render something to a jade template.
			// res.render('index.jade', { user : req.user });

	});

};
