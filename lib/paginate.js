'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');


/**
 * Constructor for creating Paginate objects
 *
 * **Example**
 *
 * ```js
 * var items = [...];
 * var options = {
 *  limit: 10
 * };
 * var paginate = new Paginate(items, options);
 * ```
 *
 * @param {Array} `collection` items to paginate over
 * @return {Object} new instance of Paginate
 */

var Paginate = function (collection, options) {
  this.options = options || {};
  this.collection = collection || [];
};


/**
 * Calculate the pagination pages based on the collection and options.
 *
 * **Example**
 *
 * ```js
 * ```
 * @api private
 */

Paginate.prototype.calculate = function () {
  if (this._pages) {
    return;
  }
  this.options = _.extend({limit: 10}, this.options);
  this._pages = [];

  var total_pages = Math.ceil(this.collection.length / this.options.limit);
  var page = 1;
  while (page <= total_pages) {
    var paginator = {
      page: page, // current page number
      limit: this.options.limit, // per page
      total_pages: total_pages,
      first: 1,
      previous_page: (page === 1 ? null : page - 1),
      next_page: (page === total_pages ? null : page + 1),
      last: total_pages
    };

    var start = (page - 1) * this.options.limit;
    var end = start + this.options.limit;
    paginator.items = this.collection.slice(start, end);

    paginator[this.options.plural] = paginator.items.length; // items on current page
    paginator['total_' + this.options.plural] = this.collection.length;

    this._pages.push(paginator);
    page++;
  }

};


/**
 * Get an individual page.
 *
 * **Example**
 *
 * ```js
 * var first = paginate.page(1);
 * //=> information about the first page
 *
 * var last = paginate.page(paginate.pages.length);
 * //=> information about the last page
 * ```
 *
 * @param {Number} `page` index of the page to get (1 based)
 * @return {Object} pagination information for the page
 */

Paginate.prototype.page = function (page) {
  page = page || 1;
  return this.pages[page - 1];
};


/**
 * List of pages
 *
 * Get all the pages with pagination information
 *
 * **Example**
 *
 * ```js
 * var pages = paginate.pages;
 * //=> [{page:1,...},{page:2,...}]
 * ```
 * @return {Array} list of pages
 */

Object.defineProperty(Paginate.prototype, 'pages', {
  get: function () {
    this.calculate();
    return this._pages;
  }
});

module.exports = Paginate;