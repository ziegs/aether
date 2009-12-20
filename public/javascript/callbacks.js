// Query callbacks. These should probably be in a different file or come from the server. Oops.
function allAirportsCallback_(dialog) {
  var buttons = {
    'Continue': function() {
      makeRequestAndUpdate('AllAirports', {});
      dialog.dialog('close');
    },
    Cancel: function() {
      dialog.dialog('close');
    }
  };
  makeModalDialog(dialog, 'Warning', MSG_LONG_QUERY, buttons);
  return false;
};

function allAirportsInCountryCallback_(dialog) {
  var content = '<form class="ui-widget">' +
      '<label for="country">Country:</label>' +
      '<input id="p1" name="country" /><br />' +
      '</form>';
  makeRequestDialog(dialog, 'Airports in Country', content, function() {
    makeRequestAndUpdate('AllAirportsInCountry', {'p1': $('#p1').val()});
  });
  return false;
};

function allRoutesCallback_(dialog) {
  var buttons = {
    'Continue': function() {
      makeRequestAndUpdate('AllRoutes', {});
      $(this).dialog('close');
    },
    Cancel: function() {
      $(this).dialog('close');
    }
  };
  makeModalDialog(dialog, 'Warning', MSG_LONG_QUERY, buttons);
  return false;
};

function allAirlinesCallback_(dialog) {
  var buttons = {
    'Continue': function() {
      makeRequestAndUpdate('AllAirlines', {});
      $(this).dialog('close');
    },
    Cancel: function() {
      $(this).dialog('close');
    }
  };
  makeModalDialog(dialog, 'Warning', MSG_LONG_QUERY, buttons);
  return false;
};
