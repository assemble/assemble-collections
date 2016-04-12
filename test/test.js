'use strict';

var path = require('path');
var assert = require('assert');
var assemble = require('assemble');
var collections = require('../');
var fixtures = path.join.bind(path, __dirname, 'fixtures');
var app;

describe('assemble-collections', function() {
  beforeEach(function() {
    app = assemble();
    app.use(collections());
  });

  it('should add sync helpers to the instance', function() {
    assert.equal(typeof app._.helpers.sync.collections, 'function');
    assert.equal(typeof app._.helpers.sync.collection, 'function');
  });

  it('should create a default for categories and tags', function(cb) {
    app.page(fixtures('basic', 'a.hbs'));
    app.render('a.hbs', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, '# A\n\n- categories\n- tags');
      cb();
    });
  });

  it('should add a page to a default collection', function(cb) {
    app.page(fixtures('complex', 'categories-list.hbs'));
    app.render('categories-list.hbs', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, '# Categories list\n\n - categories-list.hbs');
      cb();
    });
  });

  it('should add multiple pages to a default collection', function(cb) {
    app.pages(fixtures('complex', 'categories', '*.hbs'));
    app.pages(fixtures('complex', 'tags', '*.hbs'));
    app.render('a.hbs', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, '# A\n\n - a.hbs - b.hbs - c.hbs');
      app.render('d.hbs', function(err, results) {
        if (err) return cb(err);
        assert.equal(results.content, '# D\n\n - d.hbs - e.hbs - f.hbs');
        cb();
      });
    });
  });

  it('should add pages to multiple default collections', function(cb) {
    app.pages(fixtures('complex', 'mixed', '*.hbs'));
    app.render('a.hbs', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, '# A\n\n## categories\n\n### foo\n- [A](a.hbs)\n- [B](b.hbs)\n- [C](c.hbs)\n\n## tags\n\n### bar\n- [A](a.hbs)\n- [B](b.hbs)\n- [C](c.hbs)\n\n### baz\n- [A](a.hbs)\n- [B](b.hbs)\n- [C](c.hbs)\n');
      cb();
    });
  });

});
