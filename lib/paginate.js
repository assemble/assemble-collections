'use strict';

var extend = require('xtend');

var Paginate = function (collection, options) {
  this.options = options || {};
  this.collection = collection || [];
};

Paginate.prototype.calculate = function () {
  if (this.pages) {
    return;
  }
  this.options = extend({limit: 10}, this.options);
  this.pages = [];


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

    this.pages.push(paginator);
    page++;
  }

};

Paginate.prototype.page = function (page) {
  page = page || 1;
  this.calculate();
  return this.pages[page - 1];
};

module.exports = Paginate;