/*
 * Use the Highsmith calendar picker with DaD.
 */

var dad = dad || {};

dad.highsmith = {

    // Turn every calendar input into a Highsmith calendar.
    set: function() {
        var calFields = document.getElementsByClassName('existingGoal--date');

        var options = {
            customDate: true,
            futureOnly: true
        }

        for (var i = 0; i < calFields.length; i++) {
            var newCal = new Highsmith(calFields[i].id, options);
        }
    }
};
