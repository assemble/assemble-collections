

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

    it('should add a new collection item to the collectionItems', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('foo');

      expect(col.collectionItems.has(new collection.CollectionItem('foo'))).to.eql(true);
    });

    it('should add new collection items in a sorted order', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('b');
      col.add('a');

      expect(col.collectionItems.toArray()[0].collectionItem).to.eql('a');
    });

  });

  describe('item collection', function() {

    it('should create a new item collection', function () {
      var itemCollection = new collection.ItemCollection();
      expect(itemCollection).to.be.instanceof(collection.ItemCollection);
    });

    it('should add a new item to the item collection', function () {
      var itemCollection = new collection.ItemCollection();
      var item = {name: 'foo', src: 'path/to/foo.hbs'}
      itemCollection.add(item);
      expect(itemCollection.items.has(item)).to.eql(true);
    });

    it('should add new items and sort them by default', function () {
      var itemCollection = new collection.ItemCollection();
      var item1 = {name: 'a', src: 'path/to/a.hbs'};
      var item2 = {name: 'b', src: 'path/to/b.hbs'};

      itemCollection.add(item2);
      itemCollection.add(item1);

      expect(itemCollection.sorted()[0]).to.eql(item1);
    });

    it('should expose items as properties by name on the collection', function () {
      var itemCollection = new collection.ItemCollection();
      var item = {name: 'foo', src: 'path/to/foo.hbs'};
      itemCollection.add(item);

      expect(itemCollection).to.have.property('foo');
      expect(itemCollection.foo).to.eql(item);
    });

    it('should allow setting properties on the item through the getter/setter', function () {
      var itemCollection = new collection.ItemCollection();
      var item = {name: 'foo', src: 'path/to/foo.hbs', metadata: { title: 'This is the original title.' } };
      itemCollection.add(item);

      expect(itemCollection.foo.metadata.title).to.eql('This is the original title.');
      itemCollection.foo.metadata.title = 'New Title';
      expect(itemCollection.foo.metadata.title).to.eql('New Title');
    });

    it('should return an item by a value on a property in the metadata', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        metadata: {
          city: 'Cincinnati'
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        metadata: {
          city: 'Cleveland'
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        metadata: {
          city: 'Convington'
        }
      });

      var actual = itemCollection.findByMetadata('Cincinnati', 'city');
      expect(actual.name).to.eql('one');
      expect(actual.metadata.city).to.eql('Cincinnati');

    });

    it('should return an item by a value on a property in the metadata using get', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        metadata: {
          city: 'Cincinnati'
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        metadata: {
          city: 'Cleveland'
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        metadata: {
          city: 'Convington'
        }
      });

      var actual = itemCollection.get('Cincinnati', 'city');
      expect(actual.name).to.eql('one');
      expect(actual.metadata.city).to.eql('Cincinnati');

    });

    it('should return an item by a value on a namespaced property in the metadata using get', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        metadata: {
          address: {
            city: 'Cincinnati'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        metadata: {
          address: {
            city: 'Cleveland'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        metadata: {
          address: {
            city: 'Convington'
          }
        }
      });

      var actual = itemCollection.get('Cincinnati', 'address.city');
      expect(actual.name).to.eql('one');
      expect(actual.metadata.address.city).to.eql('Cincinnati');

    });

    it('should return an item by a custom function', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        metadata: {
          address: {
            city: 'Cincinnati',
            state: 'OH'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        metadata: {
          address: {
            city: 'Cleveland',
            state: 'oh'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        metadata: {
          address: {
            city: 'Convington',
            state: 'KY'
          }
        }
      });

      var actual = itemCollection.get(function(page) {
        return page.metadata.address.state === 'oh';
      });
      expect(actual.name).to.eql('two');
      expect(actual.metadata.address.city).to.eql('Cleveland');
    });


  });

});

