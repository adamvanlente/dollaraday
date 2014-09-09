// ******************************************
// Schema for User accounts
// __________________________________________

var mongoose = require('mongoose');
var money    = require('../routes/helpers/money_helper');

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

    var _createNew = function(goalObject, callback) {
        _model.create(goalObject, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    var _findMany = function(userId, callback) {
        _model.find({ 'goalUser' : userId}, function(err, results) {
            if(err) {
                fail(err);
            } else {
                callback(results);
            }
        });
    }

    var _findById = function(id, callback) {
        _model.findOne({ '_id': id }, function(err, results) {
            if(err) {
                fail(err);
            } else {
                callback(results);
            }
        });

    }

    var _update = function(id, updates, callback) {

        _model.findOne({ _id: id }, function(err, goal) {

            updates.date            = updates.date.replace(/slash/g, '/');
            updates.amount          = updates.amount.replace(/,/g, '');
            updates.saved           = updates.saved.replace(/,/g, '');

            goal.goalName           = updates.name;
            goal.goalAmount         = updates.amount;
            goal.goalAmountSaved    = updates.saved;
            goal.goalTargetDate     = updates.date;
            goal.emailAlerts        = updates.alerts;


            var amountLeftToSave    = updates.amount - updates.saved;

            // Calculate the days between right now and the goal date.
            var target              = new Date(updates.date);
            var today               = new Date();
            var diffTime            = Math.abs(today.getTime() - target.getTime());
            var differenceInDays    = Math.ceil(diffTime / (1000 * 3600 * 24));

            // Colculate the dollars per day required to meet goal.
            goal.dollarsPerDay      = (amountLeftToSave / differenceInDays).toFixed(2);

            goal.save();

            var res = goal;
            res.goalAmount          = money.format(goal.goalAmount);
            res.goalAmountSaved     = money.format(goal.goalAmountSaved);
            res.dollarsPerDay       = money.format(goal.dollarsPerDay);

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
