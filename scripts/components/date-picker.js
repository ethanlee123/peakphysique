$( function() {
    $( "#datepicker" ).datepicker({
      showAnim: "fold",
      showButtonPanel: true,
      showMonthAfterYear: true,
      showOn: "both",
      showOtherMonths: true,
      minDate: 0,
      maxDate: "+1m"
    });
  });