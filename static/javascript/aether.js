/**
 * @author Matthew Ziegelbaum <mziegelbaum@acm.jhu.edu>
 * @author Parker Shelton <hpshelton@acm.jhu.edu>
 * @fileoverview Implements most of the functionality for aether.
 */

var mapObj;
var markerManager;

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

function toggleMapCallback(e) {
  $('#map').slideToggle("normal");
  return false;
};

/**
 * Initializes Google Map and basic overlays.
 */
function load() {
  $('#mapToggle').click(toggleMapCallback);
  
  var map = new GMap2(document.getElementById('map'));
  map.setMapType(G_HYBRID_MAP);
  map.setUIToDefault();
  map.addControl(new GOverviewMapControl());
  
  // For some reason, the marker manager will only work if the center is set.
  var ftWorth = new GLatLng(32.896828000,-97.037997000);
  map.setCenter(ftWorth, 7);
  
  var mgr = new MarkerManager(map, {
       trackMarkers: true
     });

  // Set up jQuery's AJAX options
  mapObj = map;
  markerManager = mgr;
};

function unload() {
  GUnload();
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
    $.getJSON('/ar/', data, dataReceivedCallback_);
  }
};

/**
 * Callback to process data returned from the server display it.
 * @param {Object} data The JSON data returned by the server.
 * @private
 */
function dataReceivedCallback_(data) {
  var headers = [];
  if (data.records && data.records.length != 0) {
    headers = extractHeaders_(data.records[0]);
  }
  updateTable_(headers, data.records);
  updateMap_(data.map_points, data.map_routes);
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
  var tbl = $('<table id="data" class="tablesorter"></table>');
  if (headers.length > 0) {
    var header = '<thead><tr>';
    $.each(headers, function(i, name) {
      header += '<th class="header">' + name + '</td>';
    });
    header += '</tr></thead>';
    tbl.append(header);
  }
  var body = '<tbody>';
  $.each(records, function(i, record) {
    trClass = (i % 2 == 0) ? 'even' : 'odd'
    body += '<tr class="' + trClass + '">'
    $.each(record, function(j, data) {
      body += '<td>' + data + '</td>';
    });
    body += '</tr>'
  });
  body += '</tbody>';
  tbl.append(body);
  $('#data').replaceWith(tbl);
  tbl.tablesorter();
};

function updateMap_(points, routes) {
  var mgr = markerManager;
  var markers = [];
  $.each(points, function(i, point) {
    var pos = new GLatLng(point['Latitude'], point['Longitude']);
    var marker = new GMarker(pos);
    markers.push(marker);
  });
  mgr.addMarkers(markers);
  mgr.refresh();
  $.each(routes, function(i, route) {
    
  });
};

// REMOVE EVENTUALLY
function toyData() {
  var data = {
    'records': [{'Name': 'LaGuardia', 'IATA': 'LGA', 'City': 'New York', 'Country': 'United States'},
                {'Name': 'Dallas-Ft. Worth', 'IATA': 'DFW', 'City': 'Dallas/Ft. Worth', 'Country': 'United States'}],
    'map_points': [{'id': 3697, 'lat': 40.777245, 'long': -73.872608},
            {'id': 3670, 'lat': 32.896828, 'long': -97.037997}],
    'map_routes': [{'src': [40.777245, -73.872608], 'dst': [32.896828, -97.037997]}]
  };
  dataReceivedCallback_(data);
};