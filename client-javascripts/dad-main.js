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
    },

    createGoalHeader: function(goal) {
        var div = dad.main.create('div');
        div.className = 'existingGoal--header';

        var span = dad.main.create('span');
        span.className = 'existingGoal--header__name';
        span.innerHTML = goal.goalName;
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
            var onclick = 'dad.main.toggleEmail(\'' + id + '\')';
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
        } else {
            form.className = form.className.replace('hidden', 'vis');
        }
    },

    toggleEmail: function(id) {
        var field = document.getElementById(id + '_existingGoal--email');
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

        dad.main.clearFormErrors();
    },

    clearFormErrors: function() {
        setTimeout(function() {
            var errors = document.getElementsByClassName('error-input');
            for (var i = 0; i < errors.length; i++) {
                var el = errors[i];
                el.className = el.className.replace('error-input', '');
                el.style.backgroundColor = '#faf8f8';
            }
        }, dad.main.timeoutInterval);
    },

    makeUpdateRequest: function(url) {
        console.log(url);
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
        console.log(data)
        var msg = 'updated stuff';
        var successDiv = document.getElementById('successMessage');
        var successMsg = document.getElementById('successMessageContent');

        successDiv.className = successDiv.className.replace('hidden', 'vis');
        successMsg.innerHTML = msg;

        setTimeout(function() {
          document.getElementById('successMessage').className =
              document.getElementById(
                'successMessage').className.replace('vis', 'hidden');
        }, dad.main.timeoutInterval);
    },

    ajax: function(url, successCb, errorCb) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data){
                successCb(data);
            },
            error: function(err) {
                errorCb(error);
            }
        });
    }

};
