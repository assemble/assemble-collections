
var ItemCollection = require('./item-collection');

var CollectionItem = module.exports = function (collectionItem) {
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
