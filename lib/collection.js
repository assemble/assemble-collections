'use strict';

/**
 * Module dependencies
 */

var SortedSet = require('collections/sorted-set');
var _ = require('lodash');


/**
 * Local modules
 */

var CollectionItem = require('./collection-item');
var Paginate = require('./paginate');


/**!
 * ## Collection
 *
 * The `Collection` model represents the entire collection (e.g. tags).
 * The model contains a list of Collection Items which are specific
 * items in the collection that have their own related items.
 * (e.g. tag called "feature" contains a list of related pages)
 */


/**
 * Default equals function for comparing collection items
 *
 * @param {Object} `a` first item to compare
 * @param {Object} `b` second item to compare
 * @return {Boolean} if the items are equal or not.
 * @api private
 */

var defaultEquals = function (a, b) {
  return a.collectionItem === b.collectionItem;
};


/**
 * Default compare function for sorting collection items
 *
 * @param {Object} `a` first item to compare
 * @param {Object} `b` second item to compare
 * @return {Number} `-1, 0, 1` to determine sort order
 * @api private
 */

var defaultCompare = function (a, b) {
  if (a.collectionItem > b.collectionItem) {
    return 1;
  } else if (a.collectionItem < b.collectionItem) {
    return -1;
  } else {
    return 0;
  }
};


/**
 * Create a getter/setter for each item to be able to reference it by name
 *
 * @param {Object} `collection` collection to add the new property to
 * @param {Object} `item` item that will be returned by name
 * @return {undefined}
 * @api private
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


/**
 * Add a getter property to an object
 *
 * @param {Object} `obj` object to add the property to
 * @param {String} `property` name of the property to add
 * @param {Function} `getFn` getter function to add for the property
 * @return {undefined}
 * @api private
 */

var createGetter = function (obj, property, getFn) {
  if (obj.hasOwnProperty(property) === false) {
    Object.defineProperty(obj, property, {
      get: getFn
    });
  }
};


/**
 * Constructor function for Collection
 *
 * Create a new Collection object that stores collections items.
 *
 * **Example**
 *
 * ```js
 * var options = {
 *   name: 'tag',
 *   plural: 'tags'
 * };
 * var col = new Collection(options);
 * //=> col.name => 'tags'
 * ```
 *
 * @param {Object} `options` options to set the name and plural properties on the collection
 * @return {Object} new instance of the Collection object
 */

var Collection = module.exports = function (options) {
  this.options = options || {};
  this.collectionItems = new SortedSet(this.options.items || [], this.options.equals || defaultEquals, this.options.compare || defaultCompare);
  this.name = this.options.name || 'collection';
  this.plural = this.options.plural || this.name;

  // expose properties as getters
  createGetter(this, this.plural, function () {
    return this.collectionItems;
  });

  createGetter(this.collectionItems, 'keys', function () {
    return this.toArray().map(function (item) {
      return item.collectionItem;
    });
  });

};


/**
 * Add a new collection item or bucket (e.g. "feature").
 * Optionally, add a related item to the collection item
 * (e.g. add a blog post about new features to the "feature" tag)
 *
 * **Example**
 *
 * ```js
 * var options = {
 *   name: 'tag',
 *   plural: 'tags'
 * };
 * var tags = new Collection(options);
 * var item = {
 *   data: {
 *     tags: ['feature']
 *   },
 *   content: 'Some content about the feature'
 * };
 * tags.add('feature', item);
 * ```
 *
 * @param {Stream} `collectionItem` collection item or bucket to add to the collection
 * @param {Object} `item` item to add to the bucket.
 * @return {undefined}
 */

Collection.prototype.add = function (collectionItem, item) {
  // create a new CollectionItem object to get access to `equals` method
  var colItem = new CollectionItem(collectionItem, this.options);

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


/**
 * Get a collection item or bucket by name
 *
 * **Example**
 *
 * ```js
 * var feature = tags.get('feature');
 * //=> collection item containing items tagged with 'feature'
 * ```
 *
 * @param {stream} `collectionItem` name of the collection item or bucket
 * @return {Object} get the collection item by name.
 */

Collection.prototype.get = function (collectionItem) {
  var colItem = new CollectionItem(collectionItem, this.options);
  return this.collectionItems.get(colItem);
};


/**
 * Get all the collection items or buckets sorted by the specified sort function
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Function} `sortFn` function used for sorting (default by collection item if not supplied)
 * @return {Array} sorted collection items.
 */

Collection.prototype.sort = function (sortFn) {
  var fn = sortFn || defaultCompare;
  if (_.isString(fn)) {
    fn = defaultCompare; // this might be updated to sort based on other things other than collectionItem
  }
  return this.collectionItems.sorted(fn);
};


/**
 * Get a list of pages for collection items based specified options
 * for index pages.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @return {Array} list of pages with pagination information
 */

Collection.prototype.pages = function () {
  var options = _.extend({}, _.pick(this.options, ['name', 'plural']), (this.options.index || {}).pagination);
  var paginate = new Paginate(this.collectionItems.toArray(), options);
  return paginate.pages;
};


/**
 * Iterate over all the collection items (buckets)
 *
 * **Example**
 *
 * ```js
 * tags.forEach(function (tag) {
 *   //=> do stuff with the tag item
 * });
 * ```
 *
 * @param {Function} `fn` function that gets called for each bucket
 * @return {undefined}
 */

Collection.prototype.forEach = function (fn) {
  this.collectionItems.toArray().forEach(fn);
};


