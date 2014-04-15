
/*
 * This model represents the entire collection (e.g. tags).
 * The model contains a list of Collection Items which are specific
 * items in the collection that have their own related items.
 * (e.g. tag called "feature" contains a list of related pages)
 */

// node_modules
var SortedSet = require('collections/sorted-set');

// local modules
var CollectionItem = require('./collection-item');

var defaultEquals = function (a, b) {
  return a.collectionItem === b.collectionItem;
};

var defaultCompare = function (a, b) {
  if (a.collectionItem > b.collectionItem) {
    return 1;
  } else if (a.collectionItem < b.collectionItem) {
    return -1;
  } else {
    return 0;
  }
};

/*
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 */
var createGetterSetter = function (collection, item) {
  if (collection.hasOwnProperty(item.collectionItem) === false) {
    Object.defineProperty(collection, item.collectionItem, {
      enumerable: true,
      get: function () {
        return collection.get(item.collectionItem);
      },
      set: function(value) {
        collection.set(value);
      }
    });
  }
};

var Collection = module.exports = function (options) {
  this.options = options || {};
  this.collectionItems = new SortedSet(this.options.items || [], this.options.equals || defaultEquals, this.options.compare || defaultCompare);
  this.name = this.options.name || 'collection';
  this.plural = this.options.plural || this.name;
};

/*
 * Add a new collection item (e.g. "feature")
 * Optionally, add a related item to a collection item
 * (e.g. add a blog post about new features to the "feature" tag)
 */
Collection.prototype.add = function (collectionItem, item) {
  // create a new CollectionItem object to get access to `equals` method
  var colItem = new CollectionItem(collectionItem);

  // if the collection item doesn't exist, add it to the collection
  if (this.collectionItems.has(colItem) === false) {
    this.collectionItems.add(colItem);
    createGetterSetter(this, colItem);
  }

  // if a related item is specified,
  // find the current collection item and add the related item
  // to it's list
  if (typeof item !== 'undefined') {
    colItem = this.collectionItems.get(colItem);
    colItem.add(item);
  }
};

Collection.prototype.get = function (collectionItem) {
  var colItem = new CollectionItem(collectionItem);
  return this.collectionItems.get(colItem);
};


