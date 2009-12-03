/**
 * @author Matthew Ziegelbaum <mziegelbaum@acm.jhu.edu>
 * @fileoverview Implements most of the functionality for aether.
 */

/**
 * Initializes Google Map and basic overlays.
 */
function load() {
  var map = new GMap2(document.getElementById('map'));
  map.addControl(new GLargeMapControl());
  map.addControl(new GOverviewMapControl());
  map.enableDoubleClickZoom();
  
  var mgr = new MarkerManager(map, {
       trackMarkers: true
     });
  var ftWorth = new GLatLng(32.896828000,-97.037997000);
  map.setCenter(ftWorth, 7);
};