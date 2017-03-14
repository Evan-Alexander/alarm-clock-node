var alarmClock = require('./../js/alarm-clock.js').alarmModule;

$(document).ready(function() {
  var showTime = function() {
    $('#time').text(moment().format("h:m:ss a"));
  };
  setInterval(showTime, 1000);



  $('#time-form').submit(function(event) {
    event.preventDefault();
      var timeInput = $('#time-input').val();
      console.log("orig " + timeInput);
      var timeObject = moment(timeInput,'H:mm').format("h:m:ss a");
      console.log("outside " + timeObject);
      // console.log(alarmClock);
      setInterval(function(){
        alarmClock(timeObject)
      }, 1000);
  });

});
