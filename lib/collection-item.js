'use strict';

/**
 * Module dependencies.
 */

var ItemCollection = require('./item-collection');
var utils = require('./utils');

/**
 * Constructor for `CollectionItem`. Creates an object containing the
 * name of the collection item and a list of items as related items.
 *
 * This model represents an item inside a collection. Each collection
 * item also has its own collection of items (e.g. "related-pages").
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {String} `collectionItem` the collectionItem or bucket
 * @param {Object} `options` additional options to pass along to the ItemCollection
 * @return {Object} new CollectionItem instance
 */

var CollectionItem = module.exports = function (collectionItem, options) {
  // this is the actual string representation of the current item
  this.collectionItem = collectionItem;
  this.items = new ItemCollection(options);

  // expose some getters
  utils.createGetter(this, 'length', function () {
    return this.items.length;
  });
};


/**
 * Default comparing function for CollectionItem objects
 * Used when objects are compared for getting.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Boolean} If the two objects are equal
 */

CollectionItem.prototype.equals = function (a, b) {
  return a.collectionItem === b.collectionItem;
};


/**
 * Compare two CollectionItems for sorting.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Number} `-1, 0, 1` to determine sorting.
 */

CollectionItem.prototype.compare = function (a, b) {
  if (a.collectionItem > b.collectionItem) {
    return 1;
  } else if (a.collectionItem < b.collectionItem) {
    return -1;
  } else {
    return 0;
  }
};


/**
 * Add a new item to the collection item list.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `item` actual item to add to this collection item list.
 * @return {undefined}
 */

CollectionItem.prototype.add = function (item) {
  this.items.add(item);
  utils.createItemsGetterSetter(this, item);
};


/**
 * Get an item from the collection
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `item` get an item from the ItemCollection list
 * @return {Object} item from the ItemColleciton
 */

CollectionItem.prototype.get = function (item) {
  return this.items.get(item);
};


/**
 * Iterate over the ItemCollection list of items.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Function} `fn` iterator function called for each ItemCollection item
 * @return {undefined}
 */

CollectionItem.prototype.forEach = function (fn) {
  this.items.items.toArray().forEach(fn);
};


/**
 * Get a list of pages with pagination information.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @return {Array} list of pagination pages.
 */

CollectionItem.prototype.pages = function () {
  return this.items.pages();
};

