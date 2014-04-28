
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

collection.createCollection = function (options) {
  options = options || {};
  options.name = options.name || 'collection';
  options.plural = options.plural || options.name;
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
  // loop over the collections in the cache and see if there's a corresponding property on the item data
  for(var key in collection.cache) {
    if (item.data.hasOwnProperty(key)) {
      var col = collection.cache[key];
      var list = item.data[key];
      if (_.isArray(list) === false) {
        list = [list];
      }
      for(var i = 0; i < list.length; i++) {
        col.add(list[i], item);
      }
    }
  }
};

