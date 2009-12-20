/**
 * @author Matthew Ziegelbaum <mziegelbaum@acm.jhu.edu>
 * @author Parker Shelton <hpshelton@acm.jhu.edu>
 * @fileoverview Implements most of the functionality for aether.
 */

var mapObj;
var markerManager;

var markersDone = false;
var tablesDone = false;

var NULL_CALLBACK = function() { $.log('Nothing to see here...'); };

var MSG_LONG_QUERY = 'This query can take more than a minute to run and returns ' +
    'a large amount of data. If you wish to continue, press continue. Otherwise, ' +
    'please click cancel.';

DEBUG = /localhost|192\.168\.\d+\.\d+/.test(window.location.hostname);

/** If you update the queries object, make sure you update the hash in aether.rb! */
var queries = {
  'AirlinesEnteringAirport': '9b',
  'AirlinesLeavingAirport': '9a',
  'AirportAtMaxElevation': '19',
  'AirportAtMinElevation': '20',
  'AirportDistance': '11',
  'AirportTimeDifference': '12',
  'AirportsAirlineServices': '5',
  'AllAirlines': '2',
  'AllAirports': '1',
  'AllRoutes': '3',
  'CostBetweenAirports': '16',
  'DestinationsFromAirport': '10',
  'RoutesAirlineServices': '7',
  'AllAirportsInCountry' : '21',
  'AirlinesBetweenCities' : '4',
  'ShortestFlight' : '8',
  'CheapestFlight' : '18'
};

var num_params = {
  'AirlinesEnteringAirport': 1,
  'AirlinesLeavingAirport': 1,
  'AirportAtMaxElevation': 0,
  'AirportAtMinElevation': 0,
  'AirportDistance': 2,
  'AirportTimeDifference': 2,
  'AirportsAirlineServices': 1,
  'AllAirlines': 0,
  'AllAirports': 0,
  'AllRoutes': 0,
  'CostBetweenAirports': 2,
  'DestinationsFromAirport': 1,
  'RoutesAirlineServices': 1,
  'AllAirportsInCountry' : 1,
  'AirlinesBetweenCities' : 2,
  'ShortestFlight' : 2,
  'CheapestFlight' : 2
};

var callbacks = {
  'AirlinesEnteringAirport': NULL_CALLBACK,
  'AirlinesLeavingAirport': NULL_CALLBACK,
  'AirportAtMaxElevation': maxElevationCallback_,
  'AirportAtMinElevation': minElevationCallback_,
  'AirportDistance': airportDistanceCallback_,
  'AirportTimeDifferences': timeChangeCallback_,
  'AirportsAirlineServices': airlineServicesCallback_,
  'AllAirlines': allAirlinesCallback_,
  'AllAirports': allAirportsCallback_,
  'AllRoutes': allRoutesCallback_,
  'CostBetweenAirports': NULL_CALLBACK,
  'DestinationsFromAirport': airportDestinationsCallback_,
  'RoutesAirlineServices': NULL_CALLBACK,
  'AllAirportsInCountry': allAirportsInCountryCallback_,
  'AirlinesBetweenCities': NULL_CALLBACK,
  'ShortestFlight': NULL_CALLBACK,
  'CheapestFlight': NULL_CALLBACK,
};

jQuery.extend({
  min: function(a, b) { return a < b ? a : b; },
  max: function(a, b) { return a > b ? a : b; }
});

/**
 * Initializes Google Map and basic overlays.
 */
function load() {
  setupNav_();
  setupHandlers_();
  
  var map = new GMap2(document.getElementById('map'));
  map.setMapType(G_HYBRID_MAP);
  map.setUIToDefault();
  map.addControl(new GOverviewMapControl());
  
  // For some reason, the marker manager will only work if the center is set.
  var ftWorth = new GLatLng(32.896828000,-97.037997000);
  map.setCenter(ftWorth, 3);
  
  var mgr = new MarkerManager(map);

  // Set up jQuery's AJAX options
  mapObj = map;
  markerManager = mgr;
};

function unload() {
  GUnload();
};

function setupNav_() {
  var dlgOpts = {
    bgiframe: false,
    resizable: false,
    modal: true,
    overlay: {
      backgroundColor: '#000',
      opacity: 0.5
    },
    autoOpen: false
  };
  var dialog = $('#dialog');
  dialog.dialog(dlgOpts);
  $('#navigation').accordion({clearStyle: true, autoHeight: true, active: 0});
  $('#navigation > div > a').each(function(i, l) {
    var link = $(this).one('click', function() {
      callbacks[l.id](dialog);
      link.click(function() {
        callbacks[l.id](dialog);
        return false;
      });
      return false;
    });
  });
};

function setupHandlers_() {
  $('#mapToggle').click(function(e) {
    $('#map').slideToggle("normal");
    return false;
  });
  
  $('#toTable').click(function(e) {
    $('html, body').animate({
      scrollTop: $('#data').offset().top
    });
    return false;
  });
  
  $('#toTop').click(function(e) {
    $('html, body').animate({
      scrollTop: 0
    });
    return false;
  });
  
  $("#data").bind("sortStart",function() { 
          $("#loading").fadeIn("normal"); 
      }).bind("sortEnd",function() { 
          $("#loading").fadeOut("normal"); 
  });
};

/**
 * Makes a request to the server and updates the map and table with the data
 * returned.
 * @param {String} query The query name.
 * @param {Object} data The map of data to pass to the server.
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
function makeRequestAndUpdate(query, data) {
  data = data || {};
  data['id'] = queries[query] || '';
  if (!!query) {
    $('#loading').fadeIn();
    $.getJSON('/ar', data, dataReceivedCallback_);
  }
};

/**
 * Callback to process data returned from the server and display it.
 * @param {Object} data The JSON data returned by the server.
 * @private
 */
function dataReceivedCallback_(data) {
  var headers = [];
  if (data.records && data.records.length != 0) {
    headers = extractHeaders_(data.records[0]);
  }
  tablesDone = false;
  markersDone = false;
  if (!$('#loading').is(':hidden')) {
    $('#loading').fadeIn('normal');
  }
  $('#pager').hide();
  var points = !!(data.map_points) ? data.map_points : [];
  var routes = !!(data.map_routes) ? data.map_routes : [];
  var records = !!(data.records) ? data.records : [];
  updateMap_(points, routes, true);
  updateTable_(headers, records);
  $.doTimeout('checkCompleteness', 200, function() {
    if (tablesDone && markersDone) {
      $('#loading').fadeOut('normal');
      return false;
    } else if (tablesDone){
      $.log('tables done but not markers');
    }
    return true;
  });
};

/**
 * Extracts header names from the first row of data.
 * @param {Object} record The record to grab header names from.
 */
function extractHeaders_(record) {
  var headers = [];
  $.each(record, function(key, value) {
      headers.push(key);
  });
  return headers;
};

/**
 * Updates the map and loads a table based on the server response.
 * @param {Object} data The data returned by jQuery's .getJSON.
 * @private
 */
function updateTable_(headers, records) {
  tablesDone = false;
  $('#progress').progressbar({value: 0});
  var tbl = $('<table id="data" class="tablesorter"></table>');
  if (headers.length > 0) {
    var header = '<thead><tr>';
    $.each(headers, function(i, name) {
      header += '<th class="header">' + name + '</td>';
    });
    header += '</tr></thead>';
    tbl.append(header);
  }
  var body = '<tbody></tbody>';
  tbl.append(body);
  $('#data').replaceWith(tbl);
  $('#data').hide();
  var i = 0;
  var length = records.length;
  var rowCache = "";
  if (records.length > 0) {
    $.doTimeout('updateTable', 0, function() {
      if (i >= length) {
        $('#data').append(rowCache);
        rowCache = "";
        $('#data').tablesorter({widthFixed: true});
        $.log('Setting up paginator...');
        var pagerOpts = {container: $("#pager"), positionFixed: false, size: $('#pager > select').val()};
        $('#data').tablesorterPager(pagerOpts);
        $.log('...pagination complete');
        $('#pager').fadeIn();
        $('#data').fadeIn();
        tablesDone = true;
        return false;
      };
      var trClass = i % 2 == 0 ? 'even' : 'odd';
      rowCache += '<tr class="' + trClass + '">';
      $.each(headers, function(x, name) {
        rowCache += '<td>' + records[i][name] + '</td>';
      });
      rowCache += '</tr>';
      i++;
      $('#progress').progressbar('option', 'value', (i/length) * 100);
      if (i % 25 == 0) {
        // Flush the rowcache and write some rows to the DOM
        $('#data').append(rowCache);
        rowCache = "";
      }
      if (i % 500 == 0) {
        $.log('Finished ' + i + ' records...');
      }
      return true;
    });
  } else {
    tablesDone = true;
  }
};

function updateMap_(points, routes, opt_clearFirst) {
  var mgr = markerManager;
  if (!!opt_clearFirst) {
    mgr.clearMarkers();
    mapObj.clearOverlays();
  }
  
  var i = 0;
  var length = points.length;
  var largestAirport = null;
  var largestAirportSize = -500;
  $.log('markers');
  $.doTimeout('placeMarkers', 0, function() {
    if (i >= length) {
      mgr.refresh();
      markersDone = true;
      if (largestAirport) {
        mapObj.setCenter(largestAirport, $.max(8 - size, 3));
      }
      $.log('Finished loading markers');
      return false;
    }
    var point = points[i];
    var size = point['NumRunways'];
    var pos = new GLatLng(point['Latitude'], point['Longitude']);
    var marker = new GMarker(pos);
    if (size > largestAirportSize) {
      largestAirport = pos;
      largestAirportSize = size;
    }
    mgr.addMarker(marker, $.max(8 - size, 3));
    i++;
    return true;
  });

  var j = 0;
  var edgeLength = routes.length;
  var lineOptions = {geodesic: true};
  //There are OMG SO MANY ROUTES
  $.doTimeout('placeLines', 0, function() {
      if (j >= edgeLength) {
        return false;
      }
      var route = routes[j];
      var p1 = new GLatLng(route['srcLat'], route['srcLong']);
      var p2 = new GLatLng(route['destLat'], route['destLong']);
      var line = new GPolyline([p1, p2], '#ff0000', 1, 1, lineOptions);
      mapObj.addOverlay(line);
      j++;
      return true;
    });
};

function makeModalDialog(dialog, title, text, buttonObj) {
  dialog.text(text);
  dialog.dialog('option', 'title', title);
  dialog.dialog('option', 'buttons', buttonObj);
  dialog.dialog('open');
};

function makeRequestDialog(dialog, title, content, confirmCallback) {
  dialog.html(content);
  dialog.dialog('option', 'title', title);
  dialog.dialog('option', 'buttons', {
    Cancel: function() {
      dialog.dialog('close');
    },
    OK: function() {
      confirmCallback();
      dialog.dialog('close');
    }
  });
  dialog.dialog('open');
};

// REMOVE EVENTUALLY
function toyData() {
  var data = {
    'records': [{'Name': 'LaGuardia', 'IATA': 'LGA', 'City': 'New York', 'Country': 'United States'},
                {'Name': 'Dallas-Ft. Worth', 'IATA': 'DFW', 'City': 'Dallas/Ft. Worth', 'Country': 'United States'}],
    'map_points': [{'ID': 3697, 'Latitude': 40.777245, 'Longitude': -73.872608},
            {'ID': 3670, 'Latitude': 32.896828, 'Longitude': -97.037997}],
    'map_routes': [{'srcLat': 40.777245, 'srcLong': -73.872608, 'destLat': 32.896828, 'destLong': -97.037997}]
  };
  dataReceivedCallback_(data);
};