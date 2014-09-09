// ******************************************
// Schema for Goals.
// __________________________________________

var mongoose = require('mongoose');
var numbers  = require('../routes/helpers/numbers_helper');

var Goal = function() {

    var _schemaModel = mongoose.Schema({

        goalUser          : String,
        goalName          : String,
        goalAmount        : String,
        goalAmountSaved   : String,
        goalTargetDate    : String,
        dollarsPerDay     : String,
        emailAlerts       : String

    });

    var _model = mongoose.model('Goal', _schemaModel);

    // Create a new Goal
    var _createNew = function(goalObject, callback) {
        _model.create(goalObject, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find many Goals at once by user.  Allow for sorting.
    var _findMany = function(userId, sortParams, callback) {
        _model.find({ 'goalUser' : userId}, {}, sortParams,
            function(err, results) {

            if(err) {
                fail(err);
            } else {
                callback(results);
            }
        });
    }

    // Find one goal by its _id.
    var _findById = function(id, callback) {
        _model.findOne({ '_id': id }, function(err, results) {
            if(err) {
                fail(err);
            } else {
                callback(results);
            }
        });

    }

    // Update an existing Goal.
    var _update = function(id, updates, callback) {

        _model.findOne({ _id: id }, function(err, goal) {

            // Santize user input (form has been validated client-side).
            updates.date            = updates.date.replace(/slash/g, '/');
            updates.amount          = updates.amount.replace(/,/g, '');
            updates.saved           = updates.saved.replace(/,/g, '');

            // Update the Mongoose/Mongo object with new properties.
            goal.goalName           = updates.name;
            goal.goalAmount         = updates.amount;
            goal.goalAmountSaved    = updates.saved;
            goal.goalTargetDate     = updates.date;
            goal.emailAlerts        = updates.alerts;

            // Calculate dollars per day to reach your goal.
            var amountLeftToSave    = updates.amount - updates.saved;
            goal.dollarsPerDay      = numbers.getDollarsPerDay(
                updates.date, amountLeftToSave)

            // Save the item.
            goal.save();

            // Reformat the objects numbers for display.
            var res = goal;
            res.goalAmount          = numbers.format(goal.goalAmount);
            res.goalAmountSaved     = numbers.format(goal.goalAmountSaved);
            res.dollarsPerDay       = numbers.format(goal.dollarsPerDay);

            // Send the updated Goal back to client.
            callback(res);
        });
    }

    return {
        createNew: _createNew,
        findMany: _findMany,
        schema: _schemaModel,
        findById: _findById,
        update: _update,
        model: _model
    }
}();

module.exports = Goal;
