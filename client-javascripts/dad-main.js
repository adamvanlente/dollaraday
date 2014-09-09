/*
 * Dollar A Day Namespace.
 */

var dad = {

    // Get the value of an input element.  Add a trailing slash to prepare it
    // for use in an http request.
    getVal: function(id) {
        var val = document.getElementById(id).value;
        val = val.replace(/\//g, 'slash');
        val = val.replace(/,/g, '');
        return val + '/';
    },

    // Check if a date string is valid for use as an actual date.
    isValidDate: function() {
        var date = document.getElementById('dad-form-goal-target-date').value;
        if (!date || date == '') {
          // Empty string is invalid, for our purposes.
          return false;
        }

        // Return whether or not the date is valid.
        return (new Date(date)) != 'Invalid Date';
    },

    validateForm: function(name, user, amount, saved, usrEmail) {

      // Set an empty message, used in event of error.
      var msg = '';
      var errorInputs = [];

      var invalidAmount = isNaN(parseFloat(amount));
      if (invalidAmount) {
          msg += 'Amount must be a number.  '
          errorInputs.push('dad-form-goal-target-amount');
      }

      var invalidSaved = isNaN(parseFloat(saved));
      if (invalidSaved) {
          msg += 'Amount saved must be a number.  ';
          errorInputs.push('dad-form-goal-amount-saved');
      }

      var validDate = this.isValidDate();
      if (!validDate) {
          msg += 'Date must be a valid date in the future, eg: 12/31/2040.  ';
          errorInputs.push('dad-form-goal-target-date');
      }

      var validName = name != '/' && name != '';
      if (!validName) {
          msg += 'Goal must have a name.  ';
          errorInputs.push('dad-form-goal-name');
      }

      var validUser = user != '/' && user != '';
      var validEmail = usrEmail != '/' && usrEmail != '';
      var success = !invalidAmount && !invalidSaved && validDate && validName &&
          validUser && validEmail;

      // Return success status and message.  Message only has content if
      // there are errors.
      return {
          success: success,
          msg: msg
      };
    },

    showFormErrorsToUser: function(message) {
        console.log('error!!', message);
    },

    addNewGoal: function(id) {

      if (id) {
          var n = this.getVal(id + '_dad-form-goal-name');
          var a = this.getVal(id + '_dad-form-goal-target-amount');
          var s = this.getVal(id + '_dad-form-goal-amount-saved');
          var d = this.getVal(id + '_dad-form-goal-target-date');
          var e = this.getVal(id + '_dad-form-email-alerts');

          this.updateExistingGoal(id, n, a, s, d, e);
          return;
      }

      var name = this.getVal('dad-form-goal-name');
      var user = this.getVal('dad-form-user');
      var amount = this.getVal('dad-form-goal-target-amount');
      var saved = this.getVal('dad-form-goal-amount-saved');
      var targetDate = this.getVal('dad-form-goal-target-date');
      var alerts = this.getVal('dad-form-email-alerts');
      var usrEmail = this.getVal('dad-form-user-email');

      var formValidator =
          this.validateForm(name, user, amount, saved, usrEmail);

      if (formValidator.success) {

          // Build the url for the request.
          var url = '/goal/' + user + name + amount +
              saved + targetDate + alerts + usrEmail + '/' + id;

          // Make the request.
          $.ajax({
             url: url,
             type: 'POST',
             success: function(data){
                console.log(data);
             },
             error: function(err) {
                 console.log(err)
             }
          });
      } else {
          this.showFormErrorsToUser(formValidator.msg);
      }

    },

    updateExistingGoal: function(id, n, a, s, d, e) {

      var url = '/updategoal/' + id + '/' + n + a + s + d + e;

      // Make the request.
      $.ajax({
         url: url,
         type: 'POST',
         success: function(data){
            document.getElementById(id + '_dad-form-goal-target-amount')
                .value = data.goalAmount;
            document.getElementById(id + '_dad-form-goal-amount-saved')
                .value = data.goalAmountSaved;
            document.getElementById(id + '_dad-form-goal-per-day')
                .value = data.dollarsPerDay;
         },
         error: function(err) {
             console.log(err)
         }
      });


    }

};
