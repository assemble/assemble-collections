'use strict';

var utils = require('./lib/utils');

/**
 * Add middleware to gather collections from frontmatter and
 * provide helpers for working with collections, collection groups, and
 * views in collection groups.
 *
 * ```js
 * app.use(collections());
 * ```
 * @name collections
 * @param {Object} `config` Configuration object for setting up frontmatter collections.
 * @param {Array}  `config.exts` Array of extensions to use when adding `preRender` middleware. Defaults to `['md', 'hbs', 'html']`.
 * @param {Object} `config.collections` Optional collections to look for in view frontmatter. Default collections are `categories` and `tags`.
 * @param {Object} `config.collections.${key}` Individual collection configuration.
 * @param {String} `config.collections.${key}.inflection` Singular version of collection key: e.g. `categories: { inflection: 'category' }`
 * @param {String} `config.collections.${key}.sortOrder` Default sort direction of views in each collection. Defaults to `asc`.
 * @api public
 */

module.exports = function(config) {
  return function assembleCollections(app) {
    if (!isValidInstance(this)) {
      return;
    }

    var List = this.List;
    if (!List) {
      throw new Error('Unable to find a "List" constructor on "app".');
    }

    /**
     * 1. Add middleware to gather collection information from front-matter (data)
     * 2. Add helpers to retrieve sorted/grouped collections in templates
     * 3. ? Add data for accessing collections in templates
     */

    var opts = utils.merge({
      exts: ['md', 'hbs', 'html'],
      collections: {
        categories: {
          inflection: 'category',
          sortOrder: 'asc'
        },
        tags: {
          inflection: 'tag',
          sortOrder: 'asc'
        }
      }
    }, this.options, config);

    var collections = {};
    var collectionKeys = Object.keys(opts.collections);

    var self = this;

    /**
     * `preRender` middleware for building up a collection using the built-in `groupBy` method
     * on view collections. This middleware controlled by the passed in `regex` property on the
     * plugin configuration.
     */

    this.preRender(utils.extRegex(opts.exts), function(file, next) {
      var collection = self[file.options.collection];
      if (!collection) {
        return next();
      }
      collectionKeys.forEach(function(key) {
        if (collections.hasOwnProperty(key)) {
          return;
        }

        var collectionOpts = opts.collections[key];
        if (typeof collectionOpts === 'string') {
          collectionOpts = { inflection: collectionOpts };
        }

        var props = [`data.${key}`, `data.${collectionOpts.inflection}`];
        var group = collection.groupBy(function(item) {
          return props.reduce(function(acc, prop) {
            var val = utils.get(item, prop);
            if (typeof val !== 'undefined') {
              acc = acc.concat(val);
            }
            return acc;
          }, []);
        });
        collections[key] = group;
      });
      next();
    });

    /**
     * Helper to iterate or return an array of frontmatter collection keys.
     *
     * ```handlebars
     * {{! use as a block helper }}
     * {{#collections}}
     *   {{this.name}}
     * {{/collections}}
     *
     * {{! use as a subexpression }}
     * {{#each (collections)}}
     *   {{this.name}}
     * {{/each}}
     * ```
     *
     * @name collections
     * @api public
     */

    this.helper('collections', function(options) {
      if (options.fn) {
        return Object.keys(collections).map(function(key) {
          return options.fn({ name: key });
        }).join('\n');
      }
      return Object.keys(collections);
    });

    /**
     * Helper to return the collection instance or iterate over each collection item
     * in the collection.
     *
     * ```handlebars
     * {{! use as a block helper }}
     * {{#collection "categories"}}
     *   <span>{{category}}</span>
     *   <ul>
     *     {{#each items}}
     *       <li>{{name}}</li>
     *     {{/each}}
     *   </ul>
     * {{/collection}}
     *
     * {{! use as a subexpression }}
     * {{#each (collection "categories")}}
     *   <span>{{category}}</span>
     *   <ul>
     *     {{#each items}}
     *       <li>{{name}}</li>
     *     {{/each}}
     *   </ul>
     * {{/each}}
     * ```
     *
     * @name collection
     * @api public
     */

    this.helper('collection', function(name, options) {
      var collection = collections[name];
      if (typeof collection === 'undefined') {
        return options.fn ? options.fn() : '';
      }

      var sortBy;
      if (options.hash && typeof options.hash.sortBy === 'string') {
        sortBy = options.hash.sortBy;
      }

      var collectionOpts = opts.collections[name];
      if (options.fn) {
        // TODO: need a better way of just getting the collection items (e.g. categories, tags)
        return Object.keys(collection).map(function(key) {
          var list = collection.get(key);
          if (sortBy) {
            list = list.sortBy(sortBy);
          }
          var ctx = {
            name: key,
            inflection: collectionOpts.inflection
          };
          ctx[collectionOpts.inflection] = key;
          ctx.items = list.items;
          return options.fn(ctx);
        }).join('\n');
      }
      return collection;
    });
  };
};

function isValidInstance(app) {
  if (app.isRegistered('assemble-collections')) {
    return false;
  }
  if (app.isApp) {
    return true;
  }
  return false;
}
