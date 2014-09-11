/*
 * Dollar A Day Namespace.
 */

var dad = dad || {};

dad.main = {

    timeoutInterval: 2500,

    monthDict: [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],

    dayDict: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'],

    getExistingGoals: function() {
        // var userId = document.getElementById('userId').value;
        var userId = this.getVal('userId');
        var url = '/userGoals/' + userId + '/goalName';
        this.ajax(url, dad.main.showExistingGoals, dad.main.errorMessage);
    },

    getVal: function(id) {
        return document.getElementById(id).value;
    },

    get: function(id) {
        return document.getElementById(id);
    },

    create: function(type) {
        return document.createElement(type);
    },

    showExistingGoals: function(goals) {

        var goalDiv = dad.main.get('existingGoals');
        goalDiv.innerHTML = '';

        for (var i = 0; i < goals.length; i++) {

            var goalHolder = dad.main.create('div');
            goalHolder.className = 'goalHolder';

            var g = goals[i];

            var header = dad.main.createGoalHeader(g);
            var span = dad.main.createGoalDiv(g);

            goalHolder.appendChild(header);
            goalHolder.appendChild(span);
            goalDiv.appendChild(goalHolder);
            dad.highsmith.set();
        }

        if (!goals || !goals.length || goals.length == 0) {
            var noGoals = dad.main.create('div');
            noGoals.className = 'noGoalsFound';
            noGoals.innerHTML = 'You have no goals!<br>You should create some.';

            var calLabel = dad.main.create('label');
            calLabel.innerHTML = '<i class="fa fa-calendar"></i>';
            noGoals.appendChild(calLabel);

            goalDiv.appendChild(noGoals);
            dad.highsmith.set();
        }

    },

    createNewGoal: function(close) {
      var newGoalDiv = document.getElementById('newGoalHolder');
      newGoalDiv.className = newGoalDiv.className.replace('hidden', 'vis');
      if (close) {
          newGoalDiv.className = newGoalDiv.className.replace('vis', 'hidden');
          dad.main.clearFormErrors();
      }
      var inputs = document.getElementsByName('newgoal-input');
      for (var i = 0; i < inputs.length; i++) {
          var input = inputs[i];
          input.value = '';
      }
    },

    validateNewGoalForm: function() {
        var errorInputs = [];

        var name = document.getElementById('newGoal--name').value;
        if (name == '') {
            errorInputs.push('newGoal--name');
        }

        var amount = document.getElementById('newGoal--amount').value;
        amount = amount.replace(/\$/g, '');
        amount = amount.replace(/,/g, '');

        var amountSaved = document.getElementById('newGoal--amountSaved').value;
        amountSaved = amountSaved.replace(/\$/g, '');
        amountSaved = amountSaved.replace(/,/g, '');

        if (amount == '' || isNaN(parseInt(amount))) {
            errorInputs.push('newGoal--amount');
        }

        if (amountSaved == '' || isNaN(parseInt(amountSaved))) {
            errorInputs.push('newGoal--amountSaved');
        }

        var date = document.getElementById('newGoal--date').value;
        var testDate = new Date(date);
        if (date == '' || testDate == 'Invalid Date') {
            errorInputs.push('newGoal--date');
        }

        var alerts = document.getElementById('newGoal--email').value;

        if (errorInputs.length > 0) {
            dad.main.showFormErrors(errorInputs);
        } else {
            var userId = document.getElementById('userId').value;
            var userEmail = document.getElementById('userEmail').value;

            date = date.replace(/\//g, 'slash');

            var url = '/goal/' + userId + '/' + name + '/' + amount + '/' +
                amountSaved + '/' + date + '/' + alerts + '/' + userEmail;
            dad.main.ajax(url, dad.main.successMessage, dad.main.errorMessage);
            dad.main.createNewGoal(true);
        }
    },

    createGoalHeader: function(goal) {
        var div = dad.main.create('div');
        div.className = 'existingGoal--header';

        var span = dad.main.create('span');
        span.className = 'existingGoal--header__name';
        span.innerHTML = goal.goalName;
        var em = dad.main.create('em');
        em.innerHTML = 'email alerts: ' + goal.emailAlerts;
        span.appendChild(em);
        div.appendChild(span);

        var amountLabel = dad.main.create('label');
        amountLabel.className = 'existingGoal--header__amount';
        var dollars = goal.dollarsPerDay.split('.')[0];
        var cents = goal.dollarsPerDay.split('.')[1];
        dollars = '$' + dollars;
        cents = cents || '00';
        amountLabel.innerHTML = dollars + '<em>' + cents + '</em>' +
            '<label>a day</label>';
        div.appendChild(amountLabel)

        div.appendChild(dad.main.createDateIcon(goal, div));

        var updateButton = dad.main.create('button');
        var onclick = 'dad.main.updateGoal(\'' + goal._id + '\')';
        updateButton.className = 'existingGoal--header__button';
        updateButton.innerHTML = 'update this goal';
        updateButton.setAttribute('onclick', onclick);
        div.appendChild(updateButton);

        return div;
    },

    createDateIcon: function(goal, div) {
        var date = new Date(goal.goalTargetDate);

        var dateIcon = dad.main.create('span');
        dateIcon.className = 'date';

        var dayEm = dad.main.create('em');
        dayEm.className = 'date-day';
        dayEm.innerHTML = dad.main.dayDict[date.getDay()];
        dateIcon.appendChild(dayEm);

        var dateEm = dad.main.create('em');
        dateEm.className = 'date-date';
        dateEm.innerHTML = date.getDate();
        dateIcon.appendChild(dateEm);

        var monthEm = dad.main.create('em');
        monthEm.className = 'date-month';
        monthEm.innerHTML = dad.main.monthDict[date.getMonth()];
        dateIcon.appendChild(monthEm);

        var yearEm = dad.main.create('em');
        yearEm.className = 'date-year';
        yearEm.innerHTML = date.getFullYear();
        dateIcon.appendChild(yearEm);

        return dateIcon;
    },

    createGoalDiv: function(goal) {
        var div = dad.main.create('div');
        div.className = 'goalUpdateFormHolder hidden';
        div.id = 'goalUpdateFormHolder_' + goal._id;

        var span = dad.main.create('span');
        span.className = 'goalUpdateForm';

        dad.main.createInput('text',
            goal._id, goal.goalName, 'name', 'name', span);
        dad.main.createInput('tel',
            goal._id, goal.goalAmount, 'amount', 'amount', span);
        dad.main.createInput('tel',
            goal._id, goal.goalAmountSaved, 'amount saved', 'amountSaved', span);
        dad.main.createInput('text',
            goal._id, goal.goalTargetDate, 'target date', 'date', span);
        dad.main.createInput('text',
            goal._id, goal.emailAlerts, 'alerts', 'email', span);

        var formButton = dad.main.create('button');
        var onclick = 'dad.main.validateupdateGoalForm(\'' + goal._id + '\')';
        formButton.innerHTML = 'update!';
        formButton.setAttribute('onclick', onclick);
        formButton.className = 'update';
        span.appendChild(formButton);

        var cancelButton = dad.main.create('button');
        var onclick =
            'dad.main.updateGoal(\'' + goal._id + '\', \'' + true + '\')';
        cancelButton.innerHTML = 'cancel';
        cancelButton.setAttribute('onclick', onclick);
        cancelButton.className = 'cancel';
        span.appendChild(cancelButton);

        var deleteButton = dad.main.create('button');
        var onclick =
            'dad.main.removeGoal(\'' + goal._id + '\', \'' + true + '\')';
        deleteButton.innerHTML = 'delete';
        deleteButton.setAttribute('onclick', onclick);
        deleteButton.className = 'delete';
        span.appendChild(deleteButton);

        div.appendChild(span);

        return div;
    },

    createInput: function(type, id, value, labelText, className, parent) {

        var span = dad.main.create('span');

        var label = dad.main.create('label');
        label.innerHTML = labelText;

        className = 'existingGoal--' + className;

        var input = dad.main.create('input');
        input.type = type;
        input.id = id + '_' + className;
        input.className = className;
        input.innerHTML = value;
        input.value = value;
        input.name = id + '_goalForm';
        if (className == 'existingGoal--email') {
            input.readOnly = true;
            var onclick = 'dad.main.toggleEmail(\'' + id +
                '_existingGoal--email'  + '\')';
            input.setAttribute('onclick', onclick);
        }

        span.appendChild(label);
        span.appendChild(input);
        parent.appendChild(span);
    },

    updateGoal: function(id, close) {
        var form = document.getElementById('goalUpdateFormHolder_' + id);
        if (close) {
            form.className = form.className.replace('vis', 'hidden');
            dad.main.clearFormErrors();
        } else {
            form.className = form.className.replace('hidden', 'vis');
        }
    },

    toggleEmail: function(id) {
        var field = document.getElementById(id);
        if (field.value == 'on') {
            field.value = 'off';
        } else {
            field.value = 'on';
        }
    },

    validateupdateGoalForm: function(id) {
        var formElements = document.getElementsByName(id + '_goalForm');

        var errorInputs = [];
        var newGoalUrl = '/updategoal/' + id + '/';

        for (var i = 0; i < formElements.length; i++) {
            var el = formElements[i];

            if (el.className == 'existingGoal--name') {
                if (el.value == '') {
                    errorInputs.push(el.className);
                } else {
                    newGoalUrl += el.value + '/';
                }
            }

            if (el.className == 'existingGoal--amount' ||
                el.className == 'existingGoal--amountSaved') {
                    el.value = parseFloat(el.value.replace(/,/g, ''));

                    if (isNaN(el.value) || parseInt(el.value) < 0) {
                        errorInputs.push(el.className);
                    } else {
                        newGoalUrl += el.value + '/';
                    }
            }

            if (el.className == 'existingGoal--date') {
                var testDate = new Date(el.value);
                if (testDate == 'Invalid Date') {
                    errorInputs.push(el.className);
                } else {
                    newGoalUrl += el.value.replace(/\//g, 'slash') + '/';
                }
            }

            if (el.className == 'existingGoal--email') {
                newGoalUrl += el.value;
            }
        }
        if (errorInputs.length > 0) {
            dad.main.showFormErrors(errorInputs);
        } else {
            dad.main.makeUpdateRequest(newGoalUrl);
            dad.main.updateGoal(id, true);
        }
    },

    showFormErrors: function(errors) {
        for (var i = 0; i < errors.length; i++) {
            var className = errors[i];
            var inputs = document.getElementsByClassName(className);
            for (var j = 0; j < inputs.length; j++) {
                var el = inputs[j];
                el.className += ' error-input';
                el.style.backgroundColor = 'rgb(250, 202, 202)';
            }
        }

        var msg = 'Some form fields are incorrect.';
        dad.main.errorMessage(msg);
    },

    clearFormErrors: function() {
        var timer = setTimeout(function() {
            var errors = document.getElementsByClassName('error-input');
            for (var i = 0; i < errors.length; i++) {
                var el = errors[i];

                el.className = el.className.replace('error-input', '');
                el.style.backgroundColor = '#faf8f8';
            }

            var errors = document.getElementsByClassName('error-input');

            if (errors.length > 0) {
                dad.main.clearFormErrors();
            }

        }, 50);

    },

    makeUpdateRequest: function(url) {

        dad.main.ajax(url, dad.main.successMessage, dad.main.errorMessage)
    },

    errorMessage: function(msg) {
        var errorDiv = document.getElementById('errorMessage');
        var errorMsg = document.getElementById('errorMessageContent');

        errorDiv.className = errorDiv.className.replace('hidden', 'vis');
        errorMsg.innerHTML = msg;

        setTimeout(function() {
          document.getElementById('errorMessage').className =
              document.getElementById(
                'errorMessage').className.replace('vis', 'hidden');
        }, dad.main.timeoutInterval);
    },

    successMessage: function(data) {
        var msg = 'updated your goal ' + data.goalName;
        var successDiv = document.getElementById('successMessage');
        var successMsg = document.getElementById('successMessageContent');

        successDiv.className = successDiv.className.replace('hidden', 'vis');
        successMsg.innerHTML = msg;

        dad.main.getExistingGoals();

        setTimeout(function() {
          document.getElementById('successMessage').className =
              document.getElementById(
                'successMessage').className.replace('vis', 'hidden');
        }, dad.main.timeoutInterval);
    },

    removeGoal: function(id) {
        dad.main.updateGoal(id, true);
        var confirmationDiv = document.getElementById('confirmDelete');
        confirmationDiv.innerHTML = '';
        confirmationDiv.className =
            confirmationDiv.className.replace('hidden', 'vis');

        var holder = dad.main.create('div');
        holder.className = 'confirmDeleteHolder';

        var par = dad.main.create('p');
        par.innerHTML = 'Are you sure you want to delete this goal?';
        holder.appendChild(par);

        var cancelButton = dad.main.create('button');
        cancelButton.innerHTML = 'cancel';
        cancelButton.className = 'cancel';
        var onclick = 'dad.main.cancelDeleting(\'' + id + '\');'
        cancelButton.setAttribute('onclick', onclick);
        holder.appendChild(cancelButton);

        var confirmButton = dad.main.create('button');
        confirmButton.innerHTML = 'confirm';
        confirmButton.className = 'confirm';
        var onclick = 'dad.main.confirmDelete(\'' + id + '\')';
        confirmButton.setAttribute('onclick', onclick);
        holder.appendChild(confirmButton);

        confirmationDiv.appendChild(holder);
    },

    cancelDeleting: function(id) {
        var confirmationDiv = document.getElementById('confirmDelete');
        confirmationDiv.className =
            confirmationDiv.className.replace('vis', 'hidden');
        dad.main.updateGoal(id);
    },

    confirmDelete: function(id) {
        var url = '/removeGoal/' + id;
        dad.main.ajax(url, dad.main.deleteSuccess, dad.main.errorMessage);
    },

    deleteSuccess: function(data) {
        var msg = 'deleted goal: ' + data.goalName;
        dad.main.cancelDeleting(data._id);
        dad.main.getExistingGoals();
    },

    ajax: function(url, successCb, errorCb) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data){
                successCb(data);
            },
            error: function(err) {
                errorCb(err);
            }
        });
    }

};
