

/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var collection = require('../');

describe('collection', function() {

  describe('collection', function () {

    it('should create a new collection', function () {
      var col = new collection.Collection();
      expect(col).to.be.instanceof(collection.Collection);
    });

    it('should create a new collection with a name', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      expect(col).to.have.property('name');
      expect(col).to.have.property('plural');
      expect(col).to.have.property('collectionItems');
      expect(col.name).to.eql('tag');
      expect(col.plural).to.eql('tags');
    });

  });

  describe('item collection', function() {

    it('should create a new item collection', function () {
      var itemCollection = new collection.ItemCollection();
      expect(itemCollection).to.be.instanceof(collection.ItemCollection);
    });

  });

});

