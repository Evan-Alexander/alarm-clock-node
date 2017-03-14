var alarmClock = function(timeObject) {
  console.log("inside " + timeObject);
  if (timeObject === (moment().format("h:m:ss a"))) {
    console.log("right now " + moment().format("h:m:ss a"));
    alert('Wake up you lazy basterd!!!');
  }
}

exports.alarmModule = alarmClock;
