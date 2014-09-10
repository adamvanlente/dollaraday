/*
 * Use the Highsmith calendar picker with DaD.
 */

var dad = dad || {};

dad.highsmith = {

    // Create calendars for every date input in the goal list.
    loadCalendars: function() {

        var calendars = document.getElementsByName('make-cal');
        for (var i = 0; i < calendars.length; i++) {
            var cal = calendars[i];
            var options = { 'futureOnly' : true };
            var newCal = new Highsmith(cal.id, options);
        }
    }
};
