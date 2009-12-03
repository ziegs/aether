/**
 * @author Matthew Ziegelbaum <mziegelbaum@acm.jhu.edu>
 * @author Parker Shelton <hpshelton@acm.jhu.edu>
 * @fileoverview Implements most of the functionality for aether.
 */

var mapObj;
var markerManager;

/** If you update the queries hash, make sure you update the object in aether.rb! */
var queries0 = {
  '1' : 'AllAirports',
  '2' : 'AllAirlines',
  '3' : 'AllRoutes',
  '19' : 'AirportAtMaxElevation',
  '20' : 'AirportAtMinElevation'
}

var queries1 = {
  '5' : 'AirportsAirlineServices',
  '7' : 'RoutesAirlineServices',
  '9a' : 'AirlinesLeavingAirport',
  '9b' : 'AirlinesEnteringAirport',
  '10' : 'DestinationsFromAirport',
}

var queries2 = {
  '11' : 'AirportDistance',
  '12' : 'AirportTimeDifference',
  '16' : 'CostBetweenAirports',  
}

/**
 * Initializes Google Map and basic overlays.
 */
function load() {
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
  if (!!query) {
    $.getJSON('/ar/', data, updateUI_);
  }
};

/**
 * Updates the map and loads a table based on the server response.
 * @param {Object} data The data returned by jQuery's .getJSON.
 * @private
 */
function updateUI_(data) {
  var tbl = $('<table id="data"></table>');
  var header = tbl.append('<thead><tr></tr></thead>');
  data.headers.each(function(name) {
    header.append('<td>' + name + '</td>');
  });
  var body = tbl.append('<tbody><tr><td></td></tr></tbody>');
  $('#data').replaceWith(tbl);
};