
/*
 * This model represents a collection of
 * related items (e.g. pages) for each
 * CollectionItem (e.g. "feature")
 * in a Collection (e.g. "tags")
 */

// node_modules
var List = require('collections/list');
var traverse = require('traverse');
var _ = require('lodash');

/*
 * Default way of finding an item is by
 * the name or src property
 */
var defaultEquals = function (a, b) {
  var aKey = a.name || a.src;
  var bKey = b.name || b.src;
  return aKey === bKey;
};

/*
 * Default way of comparing two items
 * is by the name or src property
 */
var defaultCompare = function (a, b) {
  var aKey = a.name || a.src;
  var bKey = b.name || b.src;

  if (aKey > bKey) {
    return 1;
  } else if (aKey < bKey) {
    return -1;
  } else {
    return 0;
  }
};

/*
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 */
var createGetterSetter = function (itemCollection, item) {
  var key = item.name || item.src;
  if (itemCollection.hasOwnProperty(key) === false) {
    Object.defineProperty(itemCollection, key, {
      enumerable: true,
      get: function () {
        return itemCollection.get(key);
      },
      set: function(value) {
        itemCollection.set(value);
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

var ItemCollection = module.exports = function (options) {
  this.options = options || {};
  this.items = new List(this.options.items || [], this.options.equals || defaultEquals);

  // expose some getters
  createGetter(this, 'length', function () {
    return this.items.length;
  });
};

ItemCollection.prototype.add = function (item) {
  var key = item.name || item.src;
  if (this.items.has(key) === false) {
    this.items.add(item);
    createGetterSetter(this, item);
  }
};

ItemCollection.prototype.get = function (search, by) {
  if (_.isFunction(search)) {
    by = search;
  }

  if (_.isFunction(by)) {
    var results = this.items.find(search, by);
    return results && results.value;
  }

  if (typeof search === 'string') {
    if (by && typeof by === 'string') {
      return this.findByMetadata(search, by);
    }
    var item = {name: search};
    if (this.items.has(item)) {
      return this.items.get(item);
    }
  }
  return null;
};

ItemCollection.prototype.sorted = function(compare, by, order) {
  compare = compare || defaultCompare;
  if (_.isString(compare)) {
    var search = compare;
    compare = function (a, b) {
      if (typeof a.data[search] !== 'undefined' && typeof b.data[search] !== 'undefined') {
        if (a.data[search] > b.data[search]) {
          return 1;
        } else if (a.data[search] < b.data[search]) {
          return -1;
        }
      }
      return 0;
    }
  }
  return this.items.sorted(compare, by, order);
};

ItemCollection.prototype.findByMetadata = function (search, property) {
  var results = this.items.find(search, function (obj, search) {
    var value = traverse(obj.data).get(property.split('.'));
    return value === search;
  });

  if (results) {
    return results.value;
  }
  return null;
};
