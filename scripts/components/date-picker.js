import { generateUnavailableSlots } from "../util/generateUnavailableSlots.js";

$(function() {
    $( "#datepicker" ).datepicker({
      showAnim: "fold",
      showButtonPanel: true,
      showMonthAfterYear: true,
      showOn: "both",
      showOtherMonths: true,
      minDate: 0,
      maxDate: "+1m",
      dateFormat: 'dd MM yy',
      beforeShowDay: checkBadDates()
    });
  });


let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);
// get array of unavailable dates
// var $myBadDates = new Array("10 October 2010","21 November 2010","12 December 2010","13 January 2011","14 February 2011","15 March 2011");

var unavailableSlots = generateUnavailableSlots({availability: trainerID.availability});
var badDates = [];
for(var i = 0; i < unavailableSlots.length; i++) {
  var hasDate = false;
  for(var j = 0; j < badDates.length; j++) {
    if (badDates[j] === unavailableSlots[i][0]) {
      hasDate = true;
    }
  }
  if (!hasDate) {
    badDates[i] = unavailableSlots[i][0];
  }
}
var $myBadDates = badDates;

function checkBadDates(mydate){
  var $return=true;
  var $returnclass ="available";
  $checkdate = $.datepicker.formatDate('dd MM yy', mydate);
  for(var i = 0; i < $myBadDates.length; i++){    
    if($myBadDates[i] == $checkdate){
      $return = false;
      $returnclass= "unavailable";
    }
  }
  return [$return,$returnclass];
}
