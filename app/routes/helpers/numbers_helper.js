// Money formatter.
module.exports = {

    // Format a dollar amount to currency, eg 1000000 -> 1,000,000.
    format: function(amount) {

        // Separate dollars from cents.
        var dollars = amount.split('.')[0];
        var cents   = amount.split('.')[1]

        // Create a new var for dollars.
        var newDollars = '';
        var counter = 0;
        var dollarArray = dollars.split('');

        // Iterate over dollars backwards, and add a comma every third item.
        for (var i = dollarArray.length - 1; i >= 0; i--) {
            counter++;

            // Add comma every third digit.
            comma = counter % 3 == 0 && i > 0 ? ',' : '';
            newDollars = comma + String(dollarArray[i]) + newDollars;
        }

        // Be sure to add cents back on if they exist.
        return cents ? newDollars + '.' + cents : newDollars;
    },

    // Given a date and amount, calculate dollars per day needed
    // to reach that goal.
    getDollarsPerDay: function(date, amount) {
        var target      = new Date(date);
        var today       = new Date();
        var diffTime    = Math.abs(today.getTime() - target.getTime());
        var diffDays    = Math.ceil(diffTime / (1000 * 3600 * 24));

        // Colculate the dollars per day required to meet goal.
        return (amount / diffDays).toFixed(2);
    }

};
