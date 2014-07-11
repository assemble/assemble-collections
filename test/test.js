

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

  beforeEach(function () {
    collection.cache = [];
  });

  describe('helper methods', function () {

    it('should return all the collections as an array', function () {
      var tagsCollectionOpts = {
        name: 'tag',
        plural: 'tags'
      };

      var archiveCollectionOpts = {
        name: 'archive',
        plural: 'archives'
      };

      collection.createCollection(tagsCollectionOpts);
      collection.createCollection(archiveCollectionOpts);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', locals: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', locals: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', locals: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      var actual = collection.collections;
      expect(actual.length).to.eql(2);

    });

    it('should iterate over all collections', function () {
      var tagsCollectionOpts = {
        name: 'tag',
        plural: 'tags'
      };

      var archiveCollectionOpts = {
        name: 'archive',
        plural: 'archives'
      };

      collection.createCollection(tagsCollectionOpts);
      collection.createCollection(archiveCollectionOpts);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', locals: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', locals: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', locals: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      var actual = 0;
      collection.forEach(function (col) {
        actual++;
      });
      expect(actual).to.eql(2);
    });

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
      var item1 = {name: 'post1', src: 'path/to/post/1.hbs', locals: { title: 'First Awesome Post' } };
      var item2 = {name: 'post2', src: 'path/to/post/2.hbs', locals: { title: 'Second Awesome Post' } };
      var item3 = {name: 'post3', src: 'path/to/post/3.hbs', locals: { title: 'Third Awesome Post' } };

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
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', locals: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', locals: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', locals: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      // items count
      expect(tagsCollection.tags.length).to.eql(3);
      expect(archivesCollection.archives.length).to.eql(7);

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

    it('should return a sorted list of collection items', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('b');
      col.add('a');
      col.add('c');

      var actual = col.sort(function (a, b) {
        if (a.collectionItem < b.collectionItem) {
          return 1;
        } else if (a.collectionItem > b.collectionItem) {
          return -1;
        }
        return 0;
      });


      expect(actual[0].collectionItem).to.eql('c');
    });

    it('should return the collection item keys', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('b');
      col.add('a');
      col.add('c');

      var actual = col.collectionItems.keys;
      expect(actual.length).to.eql(3);
      expect(actual[0]).to.eql('a');
      expect(actual[1]).to.eql('b');
      expect(actual[2]).to.eql('c');
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

      var collectionItem = new collection.CollectionItem('a', options);
      expect(col.get('a')).to.eql(collectionItem);

    });

    it('should get a collection item by property name', function () {
      var options = {
        name: 'tag',
        plural: 'tags'
      };
      var col = new collection.Collection(options);
      col.add('a');

      var collectionItem = new collection.CollectionItem('a', options);
      expect(col.a).to.eql(collectionItem);
    });

    it('should iterate over all collection items', function () {
      var tagsCollectionOpts = {
        name: 'tag',
        plural: 'tags'
      };

      var archiveCollectionOpts = {
        name: 'archive',
        plural: 'archives'
      };

      collection.createCollection(tagsCollectionOpts);
      collection.createCollection(archiveCollectionOpts);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', locals: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', locals: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', locals: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      var actual = 0;
      collection.forEach(function (col) {
        col.forEach(function (collectionItem) {
          actual++;
        });
      });
      expect(actual).to.eql(10);
    });


    it('should get a list of pagination objects', function () {
      var options = {
        name: 'tag',
        plural: 'tags',
        // Index of all tags
        index: {
          template: 'index.hbs',
          pagination: {
            prop: ':num',
            limit: 10,
            sortby: 'some.prop',
            sortOrder: 'ASC'
          },
          permalinks: {
            structure: ':foo/tags/:num/index.html'
          }
        },
        // Index of pages related to each tag
        related_pages: {
          template: 'related-pages.hbs',
          pagination: {
            limit: 10,
            sortby: 'some.prop',
            sortOrder: 'ASC'
          },
          permalinks: {
            structure: ':foo/tags/:tag/index.html'
          }
        }
      };
      var col = collection.createCollection(options);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }


      var actual = col.pages();
//      console.log('pages', actual);
//
//      actual.forEach(function (page) {
//        console.log('items.pages', page.items.pages());
//      });
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

    it('should sort items by locals', function () {
      var itemCollection = new collection.ItemCollection();
      var item1_1 = {name: '1x1', src: 'path/to/a.hbs', locals: {group: 'One', slug: 'First'}};
      var item1_2 = {name: '1x2', src: 'path/to/b.hbs', locals: {group: 'One', slug: 'Second'}};
      var item1_3 = {name: '1x3', src: 'path/to/c.hbs', locals: {group: 'One', slug: 'Third'}};

      var item2_1 = {name: '2x1', src: 'path/to/a.hbs', locals: {group: 'Two', slug: 'First'}};
      var item2_2 = {name: '2x2', src: 'path/to/b.hbs', locals: {group: 'Two', slug: 'Second'}};
      var item2_3 = {name: '2x3', src: 'path/to/c.hbs', locals: {group: 'Two', slug: 'Third'}};

      var item3_1 = {name: '3x1', src: 'path/to/a.hbs', locals: {group: 'Three', slug: 'First'}};
      var item3_2 = {name: '3x2', src: 'path/to/b.hbs', locals: {group: 'Three', slug: 'Second'}};
      var item3_3 = {name: '3x3', src: 'path/to/c.hbs', locals: {group: 'Three', slug: 'Third'}};

      itemCollection.add(item1_1);
      itemCollection.add(item1_2);
      itemCollection.add(item1_3);
      itemCollection.add(item2_1);
      itemCollection.add(item2_2);
      itemCollection.add(item2_3);
      itemCollection.add(item3_1);
      itemCollection.add(item3_2);
      itemCollection.add(item3_3);

      var groupMap = {
        'One': 1,
        'Two': 2,
        'Thee': 3
      };

      var by = function (item) {
        return groupMap[item.locals.group];
      };

      var actual = itemCollection.sorted({
        by: by
      });

      expect(actual[0].name).to.eql('1x1');

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
      var item = {name: 'foo', src: 'path/to/foo.hbs', locals: { title: 'This is the original title.' } };
      itemCollection.add(item);

      expect(itemCollection.foo.locals.title).to.eql('This is the original title.');
      itemCollection.foo.locals.title = 'New Title';
      expect(itemCollection.foo.locals.title).to.eql('New Title');
    });

    it('should return an item by a value on a property in the locals', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        locals: {
          city: 'Cincinnati'
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        locals: {
          city: 'Cleveland'
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        locals: {
          city: 'Convington'
        }
      });

      var actual = itemCollection.findByLocals('Cincinnati', 'city');
      expect(actual.name).to.eql('one');
      expect(actual.locals.city).to.eql('Cincinnati');

    });

    it('should return an item by a value on a property in the locals using get', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        locals: {
          city: 'Cincinnati'
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        locals: {
          city: 'Cleveland'
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        locals: {
          city: 'Convington'
        }
      });

      var actual = itemCollection.get('Cincinnati', 'city');
      expect(actual.name).to.eql('one');
      expect(actual.locals.city).to.eql('Cincinnati');

    });

    it('should return an item by a value on a namespaced property in the locals using get', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        locals: {
          address: {
            city: 'Cincinnati'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        locals: {
          address: {
            city: 'Cleveland'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        locals: {
          address: {
            city: 'Convington'
          }
        }
      });

      var actual = itemCollection.get('Cincinnati', 'address.city');
      expect(actual.name).to.eql('one');
      expect(actual.locals.address.city).to.eql('Cincinnati');

    });

    it('should return an item by a custom function', function () {
      var itemCollection = new collection.ItemCollection();
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        locals: {
          address: {
            city: 'Cincinnati',
            state: 'OH'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        locals: {
          address: {
            city: 'Cleveland',
            state: 'oh'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        locals: {
          address: {
            city: 'Convington',
            state: 'KY'
          }
        }
      });

      var actual = itemCollection.get(function(page) {
        return page.locals.address.state === 'oh';
      });
      expect(actual.name).to.eql('two');
      expect(actual.locals.address.city).to.eql('Cleveland');
    });


    it('should iterate over all items', function () {
      var tagsCollectionOpts = {
        name: 'tag',
        plural: 'tags'
      };

      var archiveCollectionOpts = {
        name: 'archive',
        plural: 'archives'
      };

      collection.createCollection(tagsCollectionOpts);
      collection.createCollection(archiveCollectionOpts);

      var items = [];
      items.push({name: 'post1', src: 'path/to/post/1.hbs', locals: { tags: ['a'], archives: ['2013', 'DEC'], title: 'First Awesome Post' } });
      items.push({name: 'post2', src: 'path/to/post/2.hbs', locals: { tags: ['a', 'b'], archives: ['2013', 'DEC'], title: 'Second Awesome Post' } });
      items.push({name: 'post3', src: 'path/to/post/3.hbs', locals: { tags: ['a', 'c'], archives: ['2014', 'JAN'], title: 'Third Awesome Post' } });
      items.push({name: 'post4', src: 'path/to/post/4.hbs', locals: { tags: ['b'], archives: ['2014', 'FEB'], title: 'Fourth Awesome Post' } });
      items.push({name: 'post5', src: 'path/to/post/5.hbs', locals: { tags: ['c'], archives: ['2014', 'MAR'], title: 'Fifth Awesome Post' } });
      items.push({name: 'post6', src: 'path/to/post/6.hbs', locals: { tags: ['b', 'c'], archives: ['2014', 'APR'], title: 'Sixth Awesome Post' } });

      for(var i = 0; i < items.length; i++) {
        collection.addItemToCollection(items[i]);
      }

      var actual = 0;
      collection.forEach(function (col) {
        col.forEach(function (collectionItem) {
          collectionItem.forEach(function (item) {
            actual++;
//            console.log(actual, col.options.name, collectionItem.collectionItem, item.name);
          });
        });
      });
      expect(actual).to.eql(21);
    });


    it('should get a list of pagination objects', function () {
      var options = {
        name: 'tag',
        plural: 'tags',
        // Index of all tags
        index: {
          template: 'index.hbs',
          pagination: {
            prop: ':num',
            limit: 10,
            sortby: 'some.prop',
            sortOrder: 'ASC'
          },
          permalinks: {
            structure: ':foo/tags/:num/index.html'
          }
        },
        // Index of pages related to each tag
        related_pages: {
          template: 'related-pages.hbs',
          pagination: {
            limit: 10,
            sortby: 'some.prop',
            sortOrder: 'ASC'
          },
          permalinks: {
            structure: ':foo/tags/:tag/index.html'
          }
        }
      };

      var itemCollection = new collection.ItemCollection(options);
      itemCollection.add({
        src: 'path/to/one.hbs',
        name: 'one',
        locals: {
          address: {
            city: 'Cincinnati',
            state: 'OH'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/two.hbs',
        name: 'two',
        locals: {
          address: {
            city: 'Cleveland',
            state: 'oh'
          }
        }
      });
      itemCollection.add({
        src: 'path/to/three.hbs',
        name: 'three',
        locals: {
          address: {
            city: 'Convington',
            state: 'KY'
          }
        }
      });

      var actual = itemCollection.pages();
//      console.log('pagination', actual);
    });



  });

});
