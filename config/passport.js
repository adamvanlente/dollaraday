// PASSPORT CONFIG

// Get Passport going with some strategies.
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy   = require('passport-github').Strategy;

// Set user model.
var User       		   = require('../app/models/user');
var bcrypt           = require('bcrypt-nodejs');

// Get the authorization variables.
var configAuth       = require('./auth');

// Expose function to app using module.exports.
module.exports = function(passport) {

    // Serialize user for session.
    passport.serializeUser(function(user, done) {
        console.log('serial')
        done(null, user.id);
    });

    // Deserialize user for session.
    passport.deserializeUser(function(id, done) {
        console.log('deserial')
        User.findById(id, function(user) {
            done(null, user);
        });
    });

 	  // ====================================
    // ====================================
    // LOCAL SIGNUP =======================
    // ====================================
    // ====================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : configAuth.formFields.emailField,
        passwordField : configAuth.formFields.passwordField,
        passReqToCallback : true
    },
    function(req, email, password, done) {
        console.log('trying to signup');
        var name = req.body["user-name"];

        process.nextTick(function() {

            User.findByEmail(email, function(user) {
                if (user || !name || name == '') {
                    return done(null, false);
                } else {
                    var newUser            = {};
                    newUser.local          = {};
                    newUser.local.email    = email;
                    newUser.local.name     = name;
                    newUser.local.password = generateHash(password);

                    User.createNew(newUser, function(doc) {
                        return done(null, doc);
                    });
                }
            });
        });
    }));


    // ====================================
    // ====================================
    // LOCAL LOGIN ========================
    // ====================================
    // ====================================
    passport.use('local-login', new LocalStrategy({
        usernameField : configAuth.formFields.emailField,
        passwordField : configAuth.formFields.passwordField,
        passReqToCallback : true
    },
    function(req, email, password, done) {

        User.findByEmail(email, function(user) {

            if (!user)
                return done(null, false);
            console.log('trying to login', user, password);

            console.log(!validPassword(password, user.local.password));

            if (!validPassword(password, user.local.password))
                return done(null, false);
            return done(null, user);
        });
    }));


    // ====================================
    // ====================================
    // FACEBOOK LOGIN =====================
    // ====================================
    // ====================================
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {

          User.findFacebookUserById(profile.id, function(user) {

              if (user) {
                  return done(null, user);
              } else {
                  // If there is no user, create one
                  var newUser               = {};
                  newUser.facebook          = {};
                  newUser.facebook.id       = profile.id;
                  newUser.facebook.token    = token;
                  newUser.facebook.name     = profile.name.givenName + ' ' + profile.name.familyName;
                  newUser.facebook.email    = profile.emails[0].value;

                  User.createNew(newUser, function(doc) {
                      return done(null, doc);
                  });

              }

          });
        });

    }));


    // ====================================
    // ====================================
    // GOOGLE LOGIN =======================
    // ====================================
    // ====================================
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

		    process.nextTick(function() {

  	        User.findGoogleUserById( profile.id, function(user) {

  	            if (user) {
  	                return done(null, user);
  	            } else {

  	                var newUser          = {};
                    newUser.google       = {};
  	                newUser.google.id    = profile.id;
  	                newUser.google.token = token;
  	                newUser.google.name  = profile.displayName;
  	                newUser.google.email = profile.emails[0].value; // pull the first email

                    User.createNew(newUser, function(doc) {
                        return done(null, doc);
                    });

  	            }
  	        });
	    });
    }));


    // ====================================
    // ====================================
    // GITHUB LOGIN =======================
    // ====================================
    // ====================================
    passport.use(new GitHubStrategy({
        clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findGithubUserById( profile.id, function(user) {

                if (user) {
                    return done(null, user);
                } else {

                    var newUser          = {};
                    newUser.github       = {};
                    newUser.github.id    = profile.id;
                    newUser.github.token = token;
                    newUser.github.name  = profile.displayName;
                    newUser.github.email = profile.emails[0].value;

                    User.createNew(newUser, function(doc) {
                        return done(null, doc);
                    });

                }
            });
      });
    }));


    // ====================================
    // ====================================
    // HELPER FUNCTIONS ===================
    // ====================================
    // ====================================

    // Generate a hash for PW.
    function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // Confirm that a hash is valid.
     function validPassword(password, userPass) {
        return bcrypt.compareSync(password, userPass);
    };


};
