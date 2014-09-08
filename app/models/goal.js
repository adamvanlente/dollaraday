// ******************************************
// Schema for User accounts
// __________________________________________

var mongoose = require('mongoose');

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


    return {
        createNew: _createNew,
        findMany: _findMany,
        schema: _schemaModel,
        model: _model
    }
}();

module.exports = Goal;
