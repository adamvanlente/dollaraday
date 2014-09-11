/*
 * Dollar A Day Namespace.
 */

var dad = dad || {};

dad.main = {

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

        dad.main.createInput(
            goal._id, goal.goalName, 'name', 'name', span);
        dad.main.createInput(
            goal._id, goal.goalAmount, 'amount', 'amount', span);
        dad.main.createInput(
            goal._id, goal.goalAmountSaved, 'amount saved', 'amountSaved', span);
        dad.main.createInput(
            goal._id, goal.goalTargetDate, 'target date', 'date', span);
        dad.main.createInput(
            goal._id, goal.emailAlerts, 'alerts', 'email', span);
        dad.main.createInput(goal._id, goal.dollarsPerDay, 'dollars per day',
            'dollarsPerDay', span);

        var formButton = dad.main.create('button');
        var onclick = 'dad.main.updateGoal(\'' + goal._id + '\')';
        formButton.innerHTML = 'update!';
        formButton.setAttribute('onclick', onclick);
        span.appendChild(formButton);

        div.appendChild(span);

        return div;
    },

    createInput: function(id, value, labelText, className, parent) {

        var span = dad.main.create('span');

        var label = dad.main.create('label');
        label.innerHTML = labelText;

        className = 'existingGoal--' + className;

        var input = dad.main.create('input');
        input.type = 'text';
        input.id = value + '_' + className;
        input.className = className;
        input.innerHTML = value;
        input.value = value;
        input.name = id + '_goalForm';

        span.appendChild(label);
        span.appendChild(input);
        parent.appendChild(span);
    },

    updateGoal: function(id) {
        var form = document.getElementById('goalUpdateFormHolder_' + id);
        form.className = form.className.replace('hidden', 'vis');
        var formElements = document.getElementsByName(id + '_goalForm');
    },

    errorMessage: function(msg) {
        console.log('error', msg);
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
