/**
 * @author Matthew Ziegelbaum <mziegelbaum@acm.jhu.edu>
 * @fileoverview Implements most of the functionality for aether.
 */

var mapObj;
var markerManager;

var queries = {
  '1': 'AllAirports',
  '2': 'AllAirlines',
  '3': 'AllRoutes',
  '5': 'AirportsAirlineServices',
  '7': 'RoutesAirlineServices',
  '9a': 'AirlinesLeavingAirport',
  '9b': 'AirlinesEnteringAirport',
  '10': 'DestinationsFromAirpot',
  '11': 'AirportDistance',
  '12': 'AirportTimeDifference',
  '16': 'CostBetweenAirports',
  '19': 'AirportAtMaxElevation',
  '20': 'AirportAtMinElevation'
}

/**
 * Initializes Google Map and basic overlays.
 */
function load() {
  var map = new GMap2(document.getElementById('map'));
  map.setMapType(G_HYBRID_MAP);
  map.setUIToDefault();
  map.addControl(new GOverviewMapControl());
  map.enableDoubleClickZoom();
  
  // For some reason, the marker manager will only work if the center is set.
  var ftWorth = new GLatLng(32.896828000,-97.037997000);
  map.setCenter(ftWorth, 7);
  
  var mgr = new MarkerManager(map, {
       trackMarkers: true
     });
  mapObj = map;
  markerManager = mgr;
};

function unload() {
  GUnload();
};