var dad = dad || {};

dad.hammer = {

  setGoalSliders: function(id) {

      var goalItems = document.getElementsByName('goal-list-item');
      for (var i = 0; i < goalItems.length; i++) {
          var item = goalItems[i];
          var id = item.id;

          var element = document.getElementById(id);
          var hammer = new Hammer(element);

          hammer.on('panstart panmove', dad.hammer.onPan);
          hammer.on('hammer.input', dad.hammer.panEnd);

      }
  },

  onPan: function(ev) {
      var x = dad.hammer.setAndLimitX(ev, 150);
      if (ev && ev.target) {
        dad.hammer.moveElement(ev.target, x);
      }
  },

  panEnd: function(ev) {
      if(ev.isFinal) {
          dad.hammer.resetElement(ev);
      }
  },

  resetElement: function(ev) {
      dad.hammer.moveElement(ev.target, 0);
      if (ev.deltaX < -100) {
          var id = ev.target.id;
          document.getElementById('goalHolder_' + id).style.display = 'block';
      }
  },

  setAndLimitX: function(ev, limit) {
      var x = ev ? ev.deltaX : 0;
      x = x < -limit ? -limit : x;
      x = x > 0 ? 0 : x;
      return x;
  },

  moveElement: function(element, x) {
      var cssStuff =
          'translate3d(' + x + 'px, 0px, 0) scale(1,1) rotate3d(0, 0, 0, 0deg)';
      element.style.webkitTransform = cssStuff;
      element.style.mozTransform = cssStuff;
      element.style.transform = cssStuff;
  }

};
