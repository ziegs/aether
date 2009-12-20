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
      '<label for="country">Country: </label>' +
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

function maxElevationCallback_(dialog) {
  makeRequestAndUpdate('AirportAtMaxElevation', {});
  return false;
}

function minElevationCallback_(dialog) {
  makeRequestAndUpdate('AirportAtMainElevation', {});
  return false;
}

function airlineServicesCallback_(dialog) {
  var content = '<form id="airline-form" class="ui-widget">' +
  '<label for="airline">Airline: </label>' +
  '<input id="p1" name="airline" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airlines', 'col' : 'Name', 'text': $('#p1').val()};
    var id;
    dataReceivedCallback_ = function() {
      id = data['ID'];
    };
    $.getJSON('/tr', data, dataReceivedCallback_);
    makeRequestAndUpdate('AirportsAirlineServices', {'p1': id})
  };
  makeRequestDialog(dialog, 'Airports Airline Services', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airlines', type: 'Name'}
                                });
  $('#airline-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function airportDestinationsCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport">Airport Code: </label>' +
  '<input id="p1" name="airport" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var id;
    dataReceivedCallback_ = function() {
      id = data['ID'];
      $.log(id);
    };
    $.getJSON('/tr', data, dataReceivedCallback_);
    $.log(id);
    makeRequestAndUpdate('AirportsAirlineServices', {'p1': id})
  };
  
  makeRequestDialog(dialog, 'Destinations From Airport', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function airportDistanceCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport1">Airport Code: </label>' +
  '<input id="p1" name="airport1" /><br />' +
  '<label for="airport2">Airport Code: </label>' +
  '<input id="p2" name="airport2" /><br />' +
  '</form>';
  var callback = function() {
    var data1 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var data2 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p2').val()};
    var id1, id2;
    dataReceivedCallback1_ = function() {
      id1 = data['ID'];
    };
    dataReceivedCallback2_ = function() {
      id2 = data['ID'];
    };
    $.getJSON('/tr', data1, dataReceivedCallback1_);
    $.getJSON('/tr', data2, dataReceivedCallback2_);
    makeRequestAndUpdate('AirportDistance', {'p1': id1, 'p2' : id2})
  };
  
  makeRequestDialog(dialog, 'Distance Between Airports', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}