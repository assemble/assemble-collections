
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

function defaultFilter (collection, item) {
  item.context = item.context || {};
  if (item.context.hasOwnProperty(collection)) {
    return Array.isArray(item.context[collection]) ? item.context[collection] : [item.context[collection]];
  }
}

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
    var buckets = col.options.filter(key, item);
    if (buckets) {
      for (var i = 0; i < buckets.length; i++) {
        col.add(buckets[i], item);
      }
    }
  }
};

