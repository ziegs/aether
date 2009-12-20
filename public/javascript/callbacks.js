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
  makeRequestAndUpdate('AirportAtMinElevation', {});
  return false;
}

function airlineServicesCallback_(dialog) {
  var content = '<form id="airline-form" class="ui-widget">' +
  '<label for="airline">Airline: </label>' +
  '<input id="p1" name="airline" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airlines', 'col' : 'Name', 'text': $('#p1').val()};
    var translationCallback = function(data) {
      var id = data['ID'];
      makeRequestAndUpdate('AirportsAirlineServices', {'p1': id})
    };
    $.getJSON('/tr', data, translationCallback);
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
    var translationCallback = function(data) {
      id = data['ID'];
      makeRequestAndUpdate('DestinationsFromAirport', {'p1': id})
    };
    $.getJSON('/tr', data, translationCallback);
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
    translationCallback1 = function(data1) {
      var id1 = data1['ID'];
      translationCallback2 = function(data2) {
        var id2 = data2['ID'];
        makeRequestAndUpdate('AirportDistance', {'p1': id1, 'p2' : id2})
      };
      $.getJSON('/tr', data2, translationCallback2);
    };    
    $.getJSON('/tr', data1, translationCallback1);
  };
  
  makeRequestDialog(dialog, 'Distance Between Airports', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#p2').autocomplete('/autofill', {
                        // cat is for table, type is for column
                        extraParams: {cat: 'Airports', type: 'IATA'}
                        });
  
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function timeChangeCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport1">Airport Code: </label>' +
  '<input id="p1" name="airport1" /><br />' +
  '<label for="airport2">Airport Code: </label>' +
  '<input id="p2" name="airport2" /><br />' +
  '</form>';
  var callback = function() {
    var data1 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var data2 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p2').val()};
    translationCallback1 = function(data1) {
      var id1 = data1['ID'];
      translationCallback2 = function(data2) {
        var id2 = data2['ID'];
        makeRequestAndUpdate('AirportTimeDifference', {'p1': id1, 'p2' : id2})
      };
      $.getJSON('/tr', data2, translationCallback2);
    };    
    $.getJSON('/tr', data1, translationCallback1);
  };
  
  makeRequestDialog(dialog, 'Time Difference Between Airports', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#p2').autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function enteringAirlinesCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport">Airport Code: </label>' +
  '<input id="p1" name="airport" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var id;
    var translationCallback = function(data) {
      id = data['ID'];
      makeRequestAndUpdate('AirlinesEnteringAirport', {'p1': id})
    };
    $.getJSON('/tr', data, translationCallback);
  };
  
  makeRequestDialog(dialog, 'Airlines Entering Airport', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function exitingAirlinesCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport">Airport Code: </label>' +
  '<input id="p1" name="airport" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var id;
    var translationCallback = function(data) {
      id = data['ID'];
      makeRequestAndUpdate('AirlinesLeavingAirport', {'p1': id})
    };
    $.getJSON('/tr', data, translationCallback);
  };
  
  makeRequestDialog(dialog, 'Airlines Departing Airport', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function airlinesBetweenCitiesCallback_(dialog) {
  var content = '<form id="cities-form" class="ui-widget">' +
  '<label for="city1">City: </label>' +
  '<input id="p1" name="city1" /><br />' +
  '<label for="city2">City: </label>' +
  '<input id="p2" name="city2" /><br />' +
  '</form>';
  var callback = function() {
    makeRequestAndUpdate('AirlinesBetweenCities', {'p1': $('#p1').val(), 'p2' : $('#p2').val()})
  };
  
  makeRequestDialog(dialog, 'Airlines Between Cities', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'City'}
                                });
  $('#p2').autocomplete('/autofill', {
                        // cat is for table, type is for column
                        extraParams: {cat: 'Airports', type: 'City'}
                        });
  
  $('#cities-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function routeCostCallback_(dialog) {
  var content = '<form id="airport-form" class="ui-widget">' +
  '<label for="airport1">Airport Code: </label>' +
  '<input id="p1" name="airport1" /><br />' +
  '<label for="airport2">Airport Code: </label>' +
  '<input id="p2" name="airport2" /><br />' +
  '</form>';
  var callback = function() {
    var data1 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
    var data2 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p2').val()};
    translationCallback1 = function(data1) {
      var id1 = data1['ID'];
      translationCallback2 = function(data2) {
        var id2 = data2['ID'];
        makeRequestAndUpdate('CostBetweenAirports', {'p1': id1, 'p2' : id2})
      };
      $.getJSON('/tr', data2, translationCallback2);
    };    
    $.getJSON('/tr', data1, translationCallback1);
  };
  
  makeRequestDialog(dialog, 'Ticket Price Between Airports', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airports', type: 'IATA'}
                                });
  $('#p2').autocomplete('/autofill', {
                        // cat is for table, type is for column
                        extraParams: {cat: 'Airports', type: 'IATA'}
                        });
  
  $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}

function cheapestFlightCallback_(dialog) {
  var buttons = {
    'Continue': function() {
      var content = '<form id="airport-form" class="ui-widget">' +
      '<label for="airport1">Airport Code: </label>' +
      '<input id="p1" name="airport1" /><br />' +
      '<label for="airport2">Airport Code: </label>' +
      '<input id="p2" name="airport2" /><br />' +
      '</form>';
      var callback = function() {
        var data1 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
        var data2 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p2').val()};
        translationCallback1 = function(data1) {
          var id1 = data1['ID'];
          translationCallback2 = function(data2) {
            var id2 = data2['ID'];
            makeRequestAndUpdate('CheapestFlight', {'p1': id1, 'p2' : id2})
          };
          $.getJSON('/tr', data2, translationCallback2);
        };    
        $.getJSON('/tr', data1, translationCallback1);
      };
      
      makeRequestDialog(dialog, 'Cheapest Ticket Price Between Airports', content, callback);
      $('#p1').focus().autocomplete('/autofill', {
                                    // cat is for table, type is for column
                                    extraParams: {cat: 'Airports', type: 'IATA'}
                                    });
      $('#p2').autocomplete('/autofill', {
                            // cat is for table, type is for column
                            extraParams: {cat: 'Airports', type: 'IATA'}
                            });
      
      $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
    },
    Cancel: function() {
      $(this).dialog('close');
    }
  };
  
  makeModalDialog(dialog, 'Warning', MSG_LONG_QUERY, buttons);
  return false;
}

function shortestFlightCallback_(dialog) {
  var buttons = {
    'Continue': function() {
      var content = '<form id="airport-form" class="ui-widget">' +
      '<label for="airport1">Airport Code: </label>' +
      '<input id="p1" name="airport1" /><br />' +
      '<label for="airport2">Airport Code: </label>' +
      '<input id="p2" name="airport2" /><br />' +
      '</form>';
      var callback = function() {
        var data1 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p1').val()};
        var data2 = {'table': 'Airports', 'col' : 'IATA', 'text': $('#p2').val()};
        translationCallback1 = function(data1) {
          var id1 = data1['ID'];
          translationCallback2 = function(data2) {
            var id2 = data2['ID'];
            makeRequestAndUpdate('ShortestFlight', {'p1': id1, 'p2' : id2})
          };
          $.getJSON('/tr', data2, translationCallback2);
        };    
        $.getJSON('/tr', data1, translationCallback1);
      };
      
      makeRequestDialog(dialog, 'Shortest Flight Between Airports', content, callback);
      $('#p1').focus().autocomplete('/autofill', {
                                    // cat is for table, type is for column
                                    extraParams: {cat: 'Airports', type: 'IATA'}
                                    });
      $('#p2').autocomplete('/autofill', {
                            // cat is for table, type is for column
                            extraParams: {cat: 'Airports', type: 'IATA'}
                            });
      
      $('#airport-form').submit(function() { callback(); dialog.dialog('close'); return false; });
    },
    Cancel: function() {
      $(this).dialog('close');
    }
  };
  
  makeModalDialog(dialog, 'Warning', MSG_LONG_QUERY, buttons);
  return false;
}

function airlineRoutesCallback_(dialog) {
  var content = '<form id="airline-form" class="ui-widget">' +
  '<label for="airline">Airline: </label>' +
  '<input id="p1" name="airline" /><br />' +
  '</form>';
  var callback = function() {
    var data = {'table': 'Airlines', 'col' : 'Name', 'text': $('#p1').val()};
    var translationCallback = function(data) {
      var id = data['ID'];
      makeRequestAndUpdate('RoutesAirlineServices', {'p1': id})
    };
    $.getJSON('/tr', data, translationCallback);
  };
  makeRequestDialog(dialog, 'Routes Airline Services', content, callback);
  $('#p1').focus().autocomplete('/autofill', {
                                // cat is for table, type is for column
                                extraParams: {cat: 'Airlines', type: 'Name'}
                                });
  $('#airline-form').submit(function() { callback(); dialog.dialog('close'); return false; });
  return false;
}