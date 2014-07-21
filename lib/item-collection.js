'use strict';

/**
 * Module dependencies
 */

var traverse = require('traverse');
var List = require('collections/list');
var _ = require('lodash');


/**
 * Local dependencies
 */

var Paginate = require('./paginate');
var utils = require('./utils');


/**
 * ## Item Collection
 *
 * Constructor for creating an item collection. This model represents a
 * collection of:
 *
 *   - related items for each item (e.g. "related pages")
 *   - CollectionItem (e.g. "feature")
 *   - in a Collection (e.g. "tags")
 *
 * **Example**
 *
 * ```js
 * var itemCollection = new ItemCollection([options]);
 * ```
 *
 * @param {Object} `options` Item collection options. Also passed to `new List()`.
 *
 * @return {Object} new instance of `ItemCollection`
 * @api public
 */

var ItemCollection = module.exports = function (options) {
  this.options = options || {};
  this.items = new List(this.options.items || [], this.options.equals || utils.defaultEquals);

  // expose some getters
  utils.createGetter(this, 'length', function () {
    return this.items.length;
  });
};


/**
 * Add an item to the item collection
 *
 * **Example**
 *
 * ```js
 * ```
 * @param {Object} `item`
 * @api public
 */

ItemCollection.prototype.add = function (item) {
  var key = item.name || item.src;
  if (this.items.has(key) === false) {
    this.items.add(item);
    utils.createGetterSetter(this, item);
  }
};


/**
 * Get an item from the items collection.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {String} `search` search term to use
 * @param {Function|String} `by` function to use for searching or key of the property to use
 * @return {Object} found item
 * @api public
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
 *
 * ```js
 * ```
 *
 * @param {Function} `compare` compare function used to determine sort order
 * @param {String} `by` what property to sort by
 * @param {String} `order` sort order
 * @return {Array} list of sorted items
 */

ItemCollection.prototype.sorted = function(compare, by, order) {
  compare = compare || utils.defaultCompare;

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
    };
  }
  return this.items.sorted(compare, by, order);
};


/**
 * Find an item based on a value in it's `data` object
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {mixed} `search` value to search for
 * @param {String} `property` propery on the `data` object to compare against
 * @return {Object} item found from the search
 */

ItemCollection.prototype.findByLocals = function (search, property) {
  var results = this.items.find(search, function (obj, search) {
    var value = traverse(obj.data).get(property.split('.'));
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
 *
 * ```js
 * ```
 *
 * @return {Array} list of pagination pages
 */

ItemCollection.prototype.pages = function () {
  var pagination = (this.options['related_pages'] || {}).pagination;
  var options = _.extend({}, _.pick(this.options, ['name', 'plural']), pagination);
  var paginate = new Paginate(this.items.toArray(), options);
  return paginate.pages;
};
