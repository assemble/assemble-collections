

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

  describe('helper methods', function () {

    it('should create a collection and add it to the cache', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = collection.createCollection(options);
      expect(col).to.be.instanceof(collection.Collection);
      expect(col.name).to.eql(options.name);
      expect(col.plural).to.eql(options.plural);
      expect(collection.cache).to.have.property(options.plural);
      expect(collection.cache[options.plural]).to.be.instanceof(collection.Collection);
      expect(collection.cache[options.plural]).to.eql(col);
    });


    it('should add a collection item to a collection', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = collection.createCollection(options);
      var item1 = {name: 'post1', src: 'path/to/post/1.hbs', metadata: { title: 'First Awesome Post' } };
      var item2 = {name: 'post2', src: 'path/to/post/2.hbs', metadata: { title: 'Second Awesome Post' } };
      var item3 = {name: 'post3', src: 'path/to/post/3.hbs', metadata: { title: 'Third Awesome Post' } };

      collection.addCollectionItem(options.plural, 'a');
      collection.addCollectionItem(options.plural, 'b');

      expect(col).to.have.property('a');
      expect(col).to.have.property('b');

    });

    it('should automatically add items to the proper collections and collection items', function () {

      var tagsCollectionOpts = {
        name: 'tag',
        plural: 'tags'
      };

      var archiveCollectionOpts = {
        name: 'archive',
        plural: 'archives'
      };

      var tagsCollection = collection.createCollection(tagsCollectionOpts);
      var archivesCollection = collection.createCollection(archiveCollectionOpts);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', metadata: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', metadata: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', metadata: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', metadata: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', metadata: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', metadata: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      // collection item counts
      expect(tagsCollection.a.length).to.eql(3);
      expect(tagsCollection.b.length).to.eql(3);
      expect(tagsCollection.c.length).to.eql(3);

      expect(archivesCollection[2013].length).to.eql(2);
      expect(archivesCollection[2014].length).to.eql(4);
      expect(archivesCollection.DEC.length).to.eql(2);
      expect(archivesCollection.JAN.length).to.eql(1);
      expect(archivesCollection.FEB.length).to.eql(1);
      expect(archivesCollection.MAR.length).to.eql(1);
      expect(archivesCollection.APR.length).to.eql(1);

      // post 1
      expect(tagsCollection.a.get('post1')).to.eql(items[0]);
      expect(archivesCollection[2013].get('post1')).to.eql(items[0]);
      expect(archivesCollection.DEC.get('post1')).to.eql(items[0]);

      // post 2
      expect(tagsCollection.a.get('post2')).to.eql(items[1]);
      expect(tagsCollection.b.get('post2')).to.eql(items[1]);
      expect(archivesCollection[2013].get('post2')).to.eql(items[1]);
      expect(archivesCollection.DEC.get('post2')).to.eql(items[1]);

      // post 3
      expect(tagsCollection.a.get('post3')).to.eql(items[2]);
      expect(tagsCollection.c.get('post3')).to.eql(items[2]);
      expect(archivesCollection[2014].get('post3')).to.eql(items[2]);
      expect(archivesCollection.JAN.get('post3')).to.eql(items[2]);

      // post 4
      expect(tagsCollection.b.get('post4')).to.eql(items[3]);
      expect(archivesCollection[2014].get('post4')).to.eql(items[3]);
      expect(archivesCollection.FEB.get('post4')).to.eql(items[3]);

      // post 5
      expect(tagsCollection.c.get('post5')).to.eql(items[4]);
      expect(archivesCollection[2014].get('post5')).to.eql(items[4]);
      expect(archivesCollection.MAR.get('post5')).to.eql(items[4]);

      // post 6
      expect(tagsCollection.b.get('post6')).to.eql(items[5]);
      expect(tagsCollection.c.get('post6')).to.eql(items[5]);
      expect(archivesCollection[2014].get('post6')).to.eql(items[5]);
      expect(archivesCollection.APR.get('post6')).to.eql(items[5]);

      /*
       * Check that everything is accessible through properties
       */

      // post 1
      expect(tagsCollection.a.post1).to.eql(items[0]);
      expect(archivesCollection[2013].post1).to.eql(items[0]);
      expect(archivesCollection.DEC.post1).to.eql(items[0]);

      // post 2
      expect(tagsCollection.a.post2).to.eql(items[1]);
      expect(tagsCollection.b.post2).to.eql(items[1]);
      expect(archivesCollection[2013].post2).to.eql(items[1]);
      expect(archivesCollection.DEC.post2).to.eql(items[1]);

      // post 3
      expect(tagsCollection.a.post3).to.eql(items[2]);
      expect(tagsCollection.c.post3).to.eql(items[2]);
      expect(archivesCollection[2014].post3).to.eql(items[2]);
      expect(archivesCollection.JAN.post3).to.eql(items[2]);

      // post 4
      expect(tagsCollection.b.post4).to.eql(items[3]);
      expect(archivesCollection[2014].post4).to.eql(items[3]);
      expect(archivesCollection.FEB.post4).to.eql(items[3]);

      // post 5
      expect(tagsCollection.c.post5).to.eql(items[4]);
      expect(archivesCollection[2014].post5).to.eql(items[4]);
      expect(archivesCollection.MAR.post5).to.eql(items[4]);

      // post 6
      expect(tagsCollection.b.post6).to.eql(items[5]);
      expect(tagsCollection.c.post6).to.eql(items[5]);
      expect(archivesCollection[2014].post6).to.eql(items[5]);
      expect(archivesCollection.APR.post6).to.eql(items[5]);
    });

  });

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

    it('should add a new collection item and related item', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      var post1 = {name: 'post1', src: 'path/to/post/1.hbs'};
      col.add('a', post1);

      expect(col.collectionItems.toArray()[0].get('post1')).to.eql(post1);
    });

    it('should get a collection item from the collection', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('a');

      var collectionItem = new collection.CollectionItem('a');
      expect(col.get('a')).to.eql(collectionItem);

    });

    it('should get a collection item by property name', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('a');

      var collectionItem = new collection.CollectionItem('a');
      expect(col.a).to.eql(collectionItem);
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

