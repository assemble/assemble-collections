# assemble-collections [![NPM version](https://badge.fury.io/js/assemble-collections.png)](http://badge.fury.io/js/assemble-collections)

> Node library for managing collections of items in or out of Assemble.

## Install
Install with [npm](npmjs.org):

```bash
npm i assemble-collections --save-dev
```

## API

Local modules
  


Static methods used to create and manage collections
  


Create a new collection with the given options

**Example**

```js
var options = {
  name: 'tag',
  plural: 'tags'
};
var tags = collection.createCollection(options);
```

* `options` {Object}: determine how the collection is setup  
* `return` {Object} a new collection object 


Add an item (bucket) to a collection.

**Example**

```js
collection.addCollectionItem('tags', 'football');
```

* `key` {String}: name of the collection to add the bucket to. 
* `collectionItem` {String}: name of the bucket to add.   


Add an item to collections that it belongs to.

**Example**

```js
item = {
  name: 'foo',
  data: {
    tags: ['football', 'baseball']
  }
};
collection.addItemToCollection(item);
//=> added to 'football' and 'baseball' tag collections
```

* `item` {Object}: item to add to collections based on filters   


Iterate over all the collections

**Example**

```js
collections.forEach(function (collection) {
  //=> do stuff to the collection
});
```

* `fn` {Function}: function that gets called for each collection   


List of collections

**Example**

```js
var collections = collection.collections;
//=> all the collections as an array
```
 
* `return` {Array} list of collections

## Collection

Module dependencies
  


Local modules
  


!
### Collection

The `Collection` model represents the entire collection (e.g. tags).
The model contains a list of Collection Items which are specific
items in the collection that have their own related items.
(e.g. tag called "feature" contains a list of related pages)
  


Constructor function for Collection

Create a new Collection object that stores collections items.

**Example**

```js
var options = {
  name: 'tag',
  plural: 'tags'
};
var col = new Collection(options);
//=> col.name => 'tags'
```

* `options` {Object}: options to set the name and plural properties on the collection  
* `return` {Object} new instance of the Collection object 


Add a new collection item or bucket (e.g. "feature").
Optionally, add a related item to the collection item
(e.g. add a blog post about new features to the "feature" tag)

**Example**

```js
var options = {
  name: 'tag',
  plural: 'tags'
};
var tags = new Collection(options);
var item = {
  data: {
    tags: ['feature']
  },
  content: 'Some content about the feature'
};
tags.add('feature', item);
```

* `collectionItem` {Stream}: collection item or bucket to add to the collection 
* `item` {Object}: item to add to the bucket.  
* `return` {undefined} 


Get a collection item or bucket by name

**Example**

```js
var feature = tags.get('feature');
//=> collection item containing items tagged with 'feature'
```

* `collectionItem` {stream}: name of the collection item or bucket  
* `return` {Object} get the collection item by name. 


Get all the collection items or buckets sorted by the specified sort function

**Example**

```js
```

* `sortFn` {Function}: function used for sorting (default by collection item if not supplied)  
* `return` {Array} sorted collection items. 


Get a list of pages for collection items based specified options
for index pages.

**Example**

```js
```
 
* `return` {Array} list of pages with pagination information 


Iterate over all the collection items (buckets)

**Example**

```js
tags.forEach(function (tag) {
  //=> do stuff with the tag item
});
```

* `fn` {Function}: function that gets called for each bucket  
* `return` {undefined}

## Collection Items

Module dependencies.
  


Constructor for `CollectionItem`. Creates an object containing the
name of the collection item and a list of items as related items.

This model represents an item inside a collection. Each collection
item also has its own collection of items (e.g. "related-pages").

**Example**

```js
```

* `collectionItem` {String}: the collectionItem or bucket 
* `options` {Object}: additional options to pass along to the ItemCollection  
* `return` {Object} new CollectionItem instance 


Default comparing function for CollectionItem objects
Used when objects are compared for getting.

**Example**

```js
```

* `a` {Object}: first object to compare 
* `b` {Object}: second object to compare  
* `return` {Boolean} If the two objects are equal 


Compare two CollectionItems for sorting.

**Example**

```js
```

* `a` {Object}: first object to compare 
* `b` {Object}: second object to compare  
* `return` {Number} `-1, 0, 1` to determine sorting. 


Add a new item to the collection item list.

**Example**

```js
```

* `item` {Object}: actual item to add to this collection item list.  
* `return` {undefined} 


Get an item from the collection

**Example**

```js
```

* `item` {Object}: get an item from the ItemCollection list  
* `return` {Object} item from the ItemColleciton 


Iterate over the ItemCollection list of items.

**Example**

```js
```

* `fn` {Function}: iterator function called for each ItemCollection item  
* `return` {undefined} 


Get a list of pages with pagination information.

**Example**

```js
```
 
* `return` {Array} list of pagination pages.

## Related Items Collection

Module dependencies
  


Local dependencies
  


### Item Collection

Constructor for creating an item collection. This model represents a
collection of:

  - related items for each item (e.g. "related pages")
  - CollectionItem (e.g. "feature")
  - in a Collection (e.g. "tags")

**Example**

```js
var itemCollection = new ItemCollection([options]);
```

* `options` {Object}: Item collection options. Also passed to `new List()`.  
* `return` {Object} new instance of `ItemCollection` 


Add an item to the item collection

**Example**

```js
```

* `item` {Object}   


Get an item from the items collection.

**Example**

```js
```

* `search` {String}: search term to use 
* `by` {Function|String}: function to use for searching or key of the property to use  
* `return` {Object} found item 


Get a sorted array of items.

**Example**

```js
```

* `compare` {Function}: compare function used to determine sort order 
* `by` {String}: what property to sort by 
* `order` {String}: sort order  
* `return` {Array} list of sorted items 


Find an item based on a value in it's `data` object

**Example**

```js
```

* `search` {mixed}: value to search for 
* `property` {String}: propery on the `data` object to compare against  
* `return` {Object} item found from the search 


Return list of pagination pages based on the 'related_pages' options

**Example**

```js
```
 
* `return` {Array} list of pagination pages

## Pagination

Module dependencies.
  


Constructor for creating Paginate objects

**Example**

```js
var items = [...];
var options = {
 limit: 10
};
var paginate = new Paginate(items, options);
```

* `collection` {Array}: items to paginate over  
* `return` {Object} new instance of Paginate 


Get an individual page.

**Example**

```js
var first = paginate.page(1);
//=> information about the first page

var last = paginate.page(paginate.pages.length);
//=> information about the last page
```

* `page` {Number}: index of the page to get (1 based)  
* `return` {Object} pagination information for the page 


List of pages

Get all the pages with pagination information

**Example**

```js
var pages = paginate.pages;
//=> [{page:1,...},{page:2,...}]
```
 
* `return` {Array} list of pages

## Usage

_(TODO)_

## Author

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)


## License
Copyright (c) 2014 Brian Woodward, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 21, 2014._
