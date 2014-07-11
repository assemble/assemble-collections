
var _ = require('lodash');

ItemCollection = require('./lib/item-collection');
Collection = require('./lib/collection');
CollectionItem = require('./lib/collection-item');

var collection = module.exports = {
  CollectionItem: CollectionItem,
  ItemCollection: ItemCollection,
  Collection: Collection
};

/*
 * Static methods used to create and manage collections
 */
collection.cache = [];


/**
 * Default filter function that returns the property on the
 * item's locals if it matches the collection name.
 *
 * **Example**
 * ```js
 * var item = {
 *   locals: {
 *     tags: ['meat', 'steak', 'dinner'],
 *     categories: ['food']
 *   }
 * };
 * var list = defaultFilter(item);
 * //=> ['meat', 'steak', 'dinner']
 * ```js
 *
 * @param {Object} `item` actual item used to determine the results.
 * @return {Array} list of buckets to add the item to on the collection
 * @private
 */

function defaultFilter (item) {
  var name = this.options.plural;
  item.locals = item.locals || {};
  if (item.locals.hasOwnProperty(name)) {
    return Array.isArray(item.locals[name]) ? item.locals[name] : [item.locals[name]];
  }
}


/**
 * Create a new collection with the given options
 *
 * **Example**
 * ```js
 * var options = {
 *   name: 'tag',
 *   plural: 'tags'
 * };
 * var tags = collection.createCollection(options);
 * ```
 *
 * @param {Object} `options` determine how the collection is setup
 * @return {Object} a new collection object
 */

collection.createCollection = function (options) {
  options = options || {};
  options.name = options.name || 'collection';
  options.plural = options.plural || options.name;
  options.filter = options.filter || defaultFilter;
  if (collection.cache.hasOwnProperty(options.plural)) {
    return collection.cache[options.plural];
  }
  return collection.cache[options.plural] = new Collection(options);
};


/**
 * Add an item (bucket) to a collection.
 *
 * @param {String} `key` name of the collection to add the bucket to.
 * @param {String} `collectionItem` name of the bucket to add.
 */

collection.addCollectionItem = function (key, collectionItem) {
  if (collection.cache.hasOwnProperty(key)) {
    collection.cache[key].add(collectionItem);
  }
  var col = collection.createCollection({name: key});
  col.add(collectionItem);
};

collection.addItemToCollection = function (item) {
  // loop over the collections in the cache and use the filter
  // to determine which buckets to add the item to
  for(var key in collection.cache) {
    var col = collection.cache[key];
    var buckets = col.options.filter.call(col, item);
    if (buckets) {
      for (var i = 0; i < buckets.length; i++) {
        col.add(buckets[i], item);
      }
    }
  }
};

Object.defineProperty(collection, 'collections', {
  get: function () {
    return Object.keys(collection.cache).map(function (key) {
      return collection.cache[key];
    });
  }
});

