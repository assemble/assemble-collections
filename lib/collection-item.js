
/*
 * This model represents an item inside a collection.
 * It also has it's own collection of items (e.g. related-pages)
 */

// Collection of related items
var ItemCollection = require('./item-collection');


/*
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 */
var createGetterSetter = function (collectionItem, item) {
  var key = item.name || item.src;
  if (collectionItem.hasOwnProperty(key) === false) {
    Object.defineProperty(collectionItem, key, {
      enumerable: true,
      get: function () {
        return collectionItem.items.get(key);
      },
      set: function(value) {
        collectionItem.items.set(value);
      }
    });
  }
};

var createGetter = function (obj, property, getFn) {
  if (obj.hasOwnProperty(property) === false) {
    Object.defineProperty(obj, property, {
      get: getFn
    });
  }
};

var CollectionItem = module.exports = function (collectionItem) {
  // this is the actual string representation of the current item
  this.collectionItem = collectionItem;
  this.items = new ItemCollection();

  // expose some getters
  createGetter(this, 'length', function () {
    return this.items.length;
  });
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
  createGetterSetter(this, item);
};

CollectionItem.prototype.get = function (item) {
  return this.items.get(item);
};
