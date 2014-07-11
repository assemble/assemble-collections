/**
 * Utils
 */

'use strict';


/**
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 *
 * **Example**
 *
 * ```js
 * ```
 * @param {Object} `collection` collection item to add item to
 * @param {Object} `item` to expose on the collection object
 * @api private
 */

exports.createGetterSetter = function (collection, item) {
  var key = item.name || item.src;

  if (collection.hasOwnProperty(key) === false) {
    Object.defineProperty(collection, key, {
      enumerable: true,
      get: function () {
        return collection.get(key);
      },
      set: function(value) {
        collection.set(value);
      }
    });
  }
};


/**
 * When adding an item to the collection
 * make sure it's accessiable by it's name
 *
 * **Example**
 *
 * ```js
 * ```
 * @param {Object} `collection` collection item to add item to
 * @param {Object} `item` item to expose on the collection object
 * @api private
 */

exports.createItemsGetterSetter = function (collection, item) {
  var key = item.name || item.src;

  if (collection.hasOwnProperty(key) === false) {
    Object.defineProperty(collection, key, {
      enumerable: true,
      get: function () {
        return collection.items.get(key);
      },
      set: function(value) {
        collection.items.set(value);
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

exports.createGetter = function (obj, property, getFn) {
  if (obj.hasOwnProperty(property) === false) {
    Object.defineProperty(obj, property, {
      get: getFn
    });
  }
};


/**
 * Compare two items to determine if they're equal
 *
 * Default way of finding an item is by the `name` or `src` property
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Boolean} If the objects are equal or not.
 * @api private
 */

exports.defaultEquals = function (a, b) {
  var aKey = a.name || a.src;
  var bKey = b.name || b.src;
  return aKey === bKey;
};


/**
 * Compare two objects to determine their sort order.
 *
 * Default way of comparing two items is by the `name` or `src` property.
 *
 * **Example**
 *
 * ```js
 * ```
 *
 * @param {Object} `a` first object to compare
 * @param {Object} `b` second object to compare
 * @return {Number} `-1, 0, 1` to determine sort order
 * @api private
 */

exports.defaultCompare = function (a, b) {
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
