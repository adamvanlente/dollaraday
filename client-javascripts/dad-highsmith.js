/*
 * Use the Highsmith calendar picker with DaD.
 */

var dad = dad || {};

dad.highsmith = {

    // Turn every calendar input into a Highsmith calendar.
    set: function() {

        var cals = document.getElementsByClassName('existingGoal--date');
        var newCals = document.getElementsByClassName('newGoal--date');

        var options = {
            customDate: true,
            futureOnly: true,
            style: {
                disable: true
            }
        }

        for (var i = 0; i < cals.length; i++) {
            var newCal = new Highsmith(cals[i].id, options);
        }

        for (var i = 0; i < newCals.length; i++) {
            var newCal = new Highsmith(newCals[i].id, options);
        }
    }
};
