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
// Hacky way to extend from GMarker...
AetherMarker.prototype = new GMarker(new GLatLng(0, 0));
