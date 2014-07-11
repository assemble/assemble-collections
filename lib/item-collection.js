
/*!
 * This model represents a collection of
 * related items (e.g. pages) for each
 * CollectionItem (e.g. "feature")
 * in a Collection (e.g. "tags")
 */

// node_modules
var List = require('collections/list');
var traverse = require('traverse');
var _ = require('lodash');
var Paginate = require('./paginate');

/**
 * Compare two items to determine if they're equal
 *
 * Default way of finding an item is by
 * the name or src property
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Boolean} If the objects are equal or not.
 * @private
 */

var defaultEquals = function (a, b) {
  var aKey = a.name || a.src;
  var bKey = b.name || b.src;
  return aKey === bKey;
};


/**
 * Compare two objects to determine their sort order.
 *
 * Default way of comparing two items
 * is by the name or src property
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Number} `-1, 0, 1` to determine sort order
 * @private
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


/**
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {Object} `itemCollection` object to add the property to
 * @param {Object} `item` actual item to add as the property
 * @return {undefined}
 * @private
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


/**
 * Add a getter property to an object
 *
 * @param {Object} `obj` object to add the property to
 * @param {String} `property` name of the property to add
 * @param {Function} `getFn` getter function to add for the property
 * @return {undefined}
 * @private
 */

var createGetter = function (obj, property, getFn) {
  if (obj.hasOwnProperty(property) === false) {
    Object.defineProperty(obj, property, {
      get: getFn
    });
  }
};


/**
 * Constructor for create an ItemCollection
 * ItemCollection holds a List of items.
 *
 * **Example**
 * ```js
 * ```
 * @return {Object} new instance of ItemCollection
 */

var ItemCollection = module.exports = function (options) {
  this.options = options || {};
  this.items = new List(this.options.items || [], this.options.equals || defaultEquals);

  // expose some getters
  createGetter(this, 'length', function () {
    return this.items.length;
  });
};


/**
 * Add an item to the item collection
 *
 * **Example**
 * ```js
 * ```
 * @return {undefined}
 */

ItemCollection.prototype.add = function (item) {
  var key = item.name || item.src;
  if (this.items.has(key) === false) {
    this.items.add(item);
    createGetterSetter(this, item);
  }
};


/**
 * Get an item from the items collection.
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {String} `search` search term to use
 * @param {Function|String} `by` function to use for searching or key of the property to use
 * @return {Object} found item
 */

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
      return this.findByLocals(search, by);
    }
    var item = {name: search};
    if (this.items.has(item)) {
      return this.items.get(item);
    }
  }
  return null;
};


/**
 * Get a sorted array of items.
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {Function} `compare` compare function used to determine sort order
 * @param {String} `by` what property to sort by
 * @param {String} `order` sort order
 * @return {Array} list of sorted items
 */

ItemCollection.prototype.sorted = function(compare, by, order) {
  compare = compare || defaultCompare;
  if (_.isString(compare)) {
    var search = compare;
    compare = function (a, b) {
      if (typeof a.locals[search] !== 'undefined' && typeof b.locals[search] !== 'undefined') {
        if (a.locals[search] > b.locals[search]) {
          return 1;
        } else if (a.locals[search] < b.locals[search]) {
          return -1;
        }
      }
      return 0;
    }
  }
  return this.items.sorted(compare, by, order);
};


/**
 * Find an item based on a value in it's `locals` object
 *
 * **Example**
 * ```js
 * ```
 *
 * @param {mixed} `search` value to search for
 * @param {String} `property` propery on the `locals` object to compare against
 * @return {Object} item found from the search
 */

ItemCollection.prototype.findByLocals = function (search, property) {
  var results = this.items.find(search, function (obj, search) {
    var value = traverse(obj.locals).get(property.split('.'));
    return value === search;
  });

  if (results) {
    return results.value;
  }
  return null;
};


/**
 * Return list of pagination pages based on the 'related_pages' options
 *
 * **Example**
 * ```js
 * ```
 *
 * @return {Array} list of pagination pages
 */

ItemCollection.prototype.pages = function () {
  var options = _.extend({}, _.pick(this.options, ['name', 'plural']), (this.options['related_pages'] || {}).pagination);
  var paginate = new Paginate(this.items.toArray(), options);
  return paginate.pages;
};
