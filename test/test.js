'use strict';

var assert = require('assert');
var assemble = require('assemble');
var collections = require('../');
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
    var content = `---
category: foo
---
{{#collections}}{{this.name}}{{/collections}}
`;

    app.page('a.md', { content: content });
    app.render('a.md', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, 'categories\ntags\n');
      cb();
    });
  });

  it('should add a page to a default collection', function(cb) {
    var content = `---
category: foo
---
{{#collection "categories"}}
<ul>
  {{#each items}}
  <li>{{path}}</li>
  {{/each}}
</ul>
{{/collection}}
`;

    var expected = `<ul>
  <li>a.md</li>
</ul>
`;

    app.page('a.md', { content: content });
    app.render('a.md', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, expected);
      cb();
    });
  });

  it('should add multiple pages to a default collection', function(cb) {
    var content = `---
category: foo
---
{{#collection "categories"}}
<ul>
  {{#each items}}
  <li>{{path}}</li>
  {{/each}}
</ul>
{{/collection}}
`;

    var expected = `<ul>
  <li>a.md</li>
  <li>b.md</li>
  <li>c.md</li>
</ul>
`;
    app.page('a.md', { content: content });
    app.page('b.md', { content: content });
    app.page('c.md', { content: content });
    app.render('a.md', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, expected);
      cb();
    });
  });

  it('should add pages to multiple default collections', function(cb) {
    var content = `---
category: foo
tag:
 - bar
 - baz
---
{{#collections}}
# {{name}}

{{#collection name}}
## {{lookup this inflection}}
{{#each items}}
- {{path}}
{{/each}}
{{/collection}}
{{/collections}}
`;

    var expected = `# categories

## foo
- a.md
- b.md
- c.md

# tags

## bar
- a.md
- b.md
- c.md

## baz
- a.md
- b.md
- c.md
`;
    app.page('a.md', { content: content });
    app.page('b.md', { content: content });
    app.page('c.md', { content: content });
    app.render('a.md', function(err, results) {
      if (err) return cb(err);
      assert.equal(results.content, expected);
      cb();
    });
  });

});
