(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./../js/alarm-clock.js":2}],2:[function(require,module,exports){
var alarmClock = function(timeObject) {
  console.log("inside " + timeObject);
  if (timeObject === (moment().format("h:m:ss a"))) {
    console.log("right now " + moment().format("h:m:ss a"));
    alert('Wake up you lazy basterd!!!');
  }
}

exports.alarmModule = alarmClock;

},{}]},{},[1]);
