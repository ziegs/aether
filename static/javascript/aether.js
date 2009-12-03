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
  var ftWorth = new GLatLng(32.896828000,-97.037997000);
  var ftWorthOptions = {title: 'Dallas-Ft. Worth'};
  map.setCenter(ftWorth, 7);
  var marker = new GMarker(ftWorth, ftWorthOptions);
  GEvent.addListener(marker, 'click', function() {
    marker.openInfoWindowHtml("THIS IS FOR YOU PARKER");
  });
  map.addOverlay(marker);
};