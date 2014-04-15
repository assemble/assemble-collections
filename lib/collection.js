
// node_modules
var SortedSet = require('collections/sorted-set');

// local modules
var CollectionItem = require('./collection-item');

var defaultEquals = function () {
};

var defaultCompare = function () {
};

var Collection = module.exports = function (options) {
  this.options = options || {};
  this.collectionItems = new SortedSet(this.options.items || [], this.options.equals || defaultEquals, this.options.compare || defaultCompare);
  this.name = this.options.name || 'collection';
  this.plural = this.options.plural || this.name;
};

Collection.prototype.add = function (collectionItem) {
  var item = new CollectionItem(collectionItem);
  if (this.collectionItems.has(item) === false) {
    this.collectionItems.add(item);
  }
};
