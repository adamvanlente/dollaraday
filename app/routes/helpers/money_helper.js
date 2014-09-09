// Money formatter.
module.exports = {

    format: function(amount) {

        var dollars = amount.split('.')[0];
        var cents   = amount.split('.')[1]

        var newDollars = '';
        var counter = 0;
        var dollarArray = dollars.split('');
        for (var i = dollarArray.length - 1; i >= 0; i--) {
            var number = String(dollarArray[i]);
            counter++;

            if (counter % 3 == 0 && i > 0) {
                newDollars = ',' + number + newDollars;
                console.log(i, number)
            } else {
                newDollars = number + newDollars;
            }

        }
        if (cents) {
            newDollars = newDollars + '.' + cents;
        }
        return newDollars;

    }

};
