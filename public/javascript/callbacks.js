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
  var content = '<form id="country-form" class="ui-widget">' +
      '<label for="country">Country:</label>' +
      '<input id="p1" name="country" /><br />' +
      '</form>';
  var callback = function() {
        makeRequestAndUpdate('AllAirportsInCountry', {'p1': $('#p1').val()})
  };
  makeRequestDialog(dialog, 'Airports in Country', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
    // cat is for table, type is for column
    extraParams: {cat: 'Airports', type: 'Country'}
  });
  $('#country-form').submit(function() { callback(); dialog.dialog('close'); return false; });
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
