/**
 * Extends Google's GMarker object to support the metadata we need for aether.
 * @author Matt Ziegelbaum <mziegelbaum@acm.jhu.edu>
 */

function AetherMarker(latlng, options) {
  this.latlng = latlng;
  options = options || {};
  this.id = options.id || '9999';
  
  GMarker.apply(this, arguments);
};

// Create our custom blue marker icon
var airportIcon = new GIcon(G_DEFAULT_ICON);
airportIcon.image = "http://maps.google.com/mapfiles/ms/micons/plane.png";
airportIcon.shadow = "http://maps.google.com/mapfiles/ms/micons/plane.shadow.png"
airportIcon.iconSize = new GSize(32, 32);
airportIcon.shadowSize = new GSize(59, 32);

// Hacky way to extend from GMarker...
AetherMarker.prototype = new GMarker(new GLatLng(0, 0), {icon: airportIcon});
