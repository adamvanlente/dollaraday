// ******************************************
// Function that sends an email about a user's
// goals.
// __________________________________________

var User       		   = require('../../models/user');
var Goal       		   = require('../../models/goal');
var nodemailer			 = require('nodemailer');
var money     			 = require('./money_helper');

// Get the authorization variables.
var configAuth       = require('../../../config/auth');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: configAuth.email.user,
        pass: configAuth.email.pass
    }
});

// Export just this function.
module.exports = {

    // Get the full list of users.
    start: function() {
        User.findAll(function(users) {
            for (var i = 0; i < users.length; i++) {
                getUserGoals(users[i]);
            }
        });
    }
};

// Get a list of goals for given user.
function getUserGoals(user) {

    // Get the user's id, name and email.
    var id                  = user._id;
    var userDetails         = getUserDetails(user);

    // If user exists, find their goals.
    if (userDetails) {

        var email           = userDetails.email;
        var name            = userDetails.name;
        var firstName       = name.split(' ')[0];

        Goal.findMany(id, function(goals) {
            var usr         = {};
            usr.id          = id;
            usr.name        = name;
            usr.email       = email;
            usr.firstName   = firstName;
            usr.goals       = goals;

            // Make sure that they actually have goals, and that if they have
            // them they are not all toggled to email notifications 'off'.
            if (usr.goals.length == 0) {
                return false;
            }

            var goalsTurnedOn = false;
            for (var i = 0; i < usr.goals.length; i++) {
                if (usr.goals[i].emailAlerts == 'on') {
                    goalsTurnedOn = true;
                }
            }
            if (!goalsTurnedOn) {
                console.log('This user has no email notification turned on',
                    usr);
                return false;
            }

            // If this point is reached, send the user an email about their
            // goals.
            sendAnEmail(usr);
        });

    } else {
        console.log('no email on file for this usr', id);
    }
}

// Determine what type of user we have.
function getUserDetails(user) {
    if (user.local.email) {
        return {
          email: user.local.email,
          name: user.local.name
        };
    } else if (user.google.email) {
        return {
          email: user.google.email,
          name: user.google.name
        };
    } else if (user.github.email) {
        return {
          email: user.github.email,
          name: user.github.name
        };
    } else if (user.facebook.email) {
        return {
          email: user.facebook.email,
          name: user.facebook.name
        };
    } else {
        console.log('no valid email found');
        return false;
    }
}

// Send an email to a user.
// TODO (perhaps a templating engine can clean this up a bit?)
function sendAnEmail(usr) {

    // Make some DOM elements for each goal.
    var goalsBody = getGoalsBody(usr.goals);

    // Compose the body of the email.
    var htmlBody =
        '<div style="font-family: Helvetica, sans-serif;text-align:center;' +
        'width:300px;margin:0 auto;">' +
        '<img src="http://jspro.io/img/favicon2.ico" style="display:block;' +
        'margin:0 auto;"/>' +
        '<p style="font-size:12px;">Hey ' + usr.firstName + '!  Here\'s' +
        ' your daily update.  Keep saving!</p>' +
          goalsBody +
          '<div style="' +
            'color:#fff;text-shadow:0 0 4px rgba(255,255,255,0.1);' +
            'display:block;margin:8px;padding:8px;border:1px solid;' +
            'border-radius:3px;border:1px solid #5EB858;">' +
            '<a href="http://www.dollaraday.io" ' +
            'style="text-decoration:none;color:#5EB858;">' +
            'stop by and update your goals!</a>' +
          '</div>' +
        '</div>';

    // Email business.
    var mailOptions = {
        from: 'Dollar a Day <dollaradayio@gmail.com>', // sender address
        to: usr.email, // list of receivers
        subject: 'Update from Dollar a Day!', // Subject line
        html: htmlBody // html body
    };

    // Use the transporter created above to send the mail.
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}

// Create some DOM elements for each of the user's goals.
function getGoalsBody(goals) {
    var goalsBody = '';

    for (var i = 0; i < goals.length; i++) {

        var goal = goals[i];
        if (goal.emailAlerts == 'on') {
            goalsBody +=
                '<div style="' +
                  'color:#fff;text-shadow:0 0 4px rgba(255,255,255,0.1);' +
                  'display:block;margin:8px;padding:8px;border:1px solid;' +
                  'border-radius:2px;background-color:#5EB858;">' +

                  '<span style="display: block;padding: 8px;' +
                    'text-align: center;color: #FFFFFF;' +
                    'font-family: Trebuchet MS, Helvetica, sans-serif;' +
                    'font-size: 28px;' +
                    'border-bottom: 2px dotted rgba(241, 241, 241, 0.62);">' +
                    '<label style="display:block;padding:8px;' +
                      'text-align:center;color:#F1F1F1;">' + goal.goalName +
                      '</label>' +
                  '</span>' +

                  '<span style="display:block;font-size: 12px;">' +
                    '<label style="padding:8px;' +
                    'display:inline-block;width:40%;text-align:right;">' +
                    'Amount: </label>' +
                    '<label style="padding:8px;display:inline-block;' +
                    'width:40%;text-align:left;">$' +
                    money.format(goal.goalAmount) +
                    '</label>' +
                  '</span>' +

                  '<span style="display:block;font-size: 12px;">' +
                    '<label style="padding:8px;' +
                    'display:inline-block;width:40%;text-align:right;">' +
                    'Saved: </label>' +
                    '<label style="padding:8px;display:inline-block;' +
                    'width:40%;text-align:left;">$' +
                    money.format(goal.goalAmountSaved) +
                    '</label>' +
                  '</span>' +

                  '<span style="display:block;font-size: 12px;">' +
                    '<label style="padding:8px;' +
                    'display:inline-block;width:40%;text-align:right;">' +
                    'Target date: </label>' +
                    '<label style="padding:8px;display:inline-block;' +
                    'width:40%;text-align:left;">' + goal.goalTargetDate +
                    '</label>' +
                  '</span>' +


                  '<span style="display:block;text-align:center;' +
                    'color: rgba(90, 90, 90, 0.9);margin-top:12px">' +
                    '<label style="display: block;font-size: 12px;">' +
                    'keep saving that</label>' +
                    '<label style="padding:8px;display:block;' +
                    'font-size: 40px;color: #2E883C;' +
                    'text-shadow: 0px 0px 15px rgba(243, 228, 228, 0.5);">' +
                    '$' + money.format(goal.dollarsPerDay) + '</label>' +
                    '<label style="display: block;font-size: 12px;">' +
                    'every day!</label>' +
                  '</span>' +

                '</div>';
        }
    }

    return goalsBody;
}
