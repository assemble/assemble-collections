
/*
 * This model represents an item inside a collection.
 * It also has it's own collection of items (e.g. related-pages)
 */

// Collection of related items
var ItemCollection = require('./item-collection');

var CollectionItem = module.exports = function (collectionItem) {
  // this is the actual string representation of the current item
  this.collectionItem = collectionItem;
  this.items = new ItemCollection();
};

CollectionItem.prototype.equals = function (a, b) {
  return a.collectionItem === b.collectionItem;
};

CollectionItem.prototype.compare = function (a, b) {
  if (a.collectionItem > b.collectionItem) {
    return 1;
  } else if (a.collectionItem < b.collectionItem) {
    return -1;
  } else {
    return 0;
  }
};

// add to the related items list
CollectionItem.prototype.add = function (item) {
  this.items.add(item);
};
