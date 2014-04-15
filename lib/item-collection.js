
// node_modules
var SortedSet = require('collections/sorted-set');

var defaultEquals = function () {
};

var defaultCompare = function () {
};

var ItemCollection = module.exports = function (options) {
  options = options || {};
  this.items = new SortedSet(options.items || [], options.equals || defaultEquals, options.compare || defaultCompare);
};

ItemCollection.prototype.add = function (item) {
  this.items.add(item);
};
