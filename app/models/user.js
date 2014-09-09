// ******************************************
// Schema for User accounts
// __________________________________________

var mongoose = require('mongoose');

var User = function() {

    var _schemaModel = mongoose.Schema({

        local            : {
            email        : String,
            password     : String,
            name         : String
        },
        facebook         : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        google           : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        github           : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        }

    });

    var _model = mongoose.model('User', _schemaModel);

    // Create a new User account.
    var _createNew = function(userObject, callback) {
        _model.create(userObject, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find a user account by _id.
    var _findById = function(id, callback) {
        _model.findOne({ '_id' : id}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }


    // Find a user by email address.
    var _findByEmail = function(email, callback) {
        _model.findOne({ 'local.email' : email}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Facebook) user by email address.
    var _findFacebookUserByEmail = function(email, callback) {
        _model.findOne({ 'facebook.email' : email}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Facebook) user by id.
    var _findFacebookUserById = function(id, callback) {
        _model.findOne({ 'facebook.id' : id}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Facebook) user by email address.
    var _findGoogleUserByEmail = function(email, callback) {
        _model.findOne({ 'google.email' : email}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Google) user by id.
    var _findGoogleUserById = function(id, callback) {
        _model.findOne({ 'google.id' : id}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Github) user by email address.
    var _findGithubUserByEmail = function(email, callback) {
        _model.findOne({ 'github.email' : email}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Find a (Github) user by id.
    var _findGithubUserById = function(id, callback) {
        _model.findOne({ 'github.id' : id}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    // Return all user accounts.
    var _findAll = function(callback) {
        _model.find({}, function(err, doc) {
            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    }

    return {
        createNew: _createNew,
        findByEmail: _findByEmail,
        findById: _findById,
        findFacebookUserByEmail: _findFacebookUserByEmail,
        findFacebookUserById: _findFacebookUserById,
        findGoogleUserByEmail: _findGoogleUserByEmail,
        findGoogleUserById: _findGoogleUserById,
        findGithubUserByEmail: _findGithubUserByEmail,
        findGithubUserById: _findGithubUserById,
        schema: _schemaModel,
        findAll: _findAll,
        model: _model
    }
}();

module.exports = User;
