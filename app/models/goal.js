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

        console.log(updates)
        callback(updates);
        // _model.findAndModify({
        //     query: { '_id': id },
        //     sort: {},
        //     update: { $inc: updates },
        //     upsert: true
        // }, function(err, results) {
        //     if(err) {
        //         fail(err);
        //     } else {
        //
        //         callback(results);
        //     }
        // })
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
