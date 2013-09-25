# Sticky JS

Elements stick to the top of the viewport when the user scrolls down.

## Installation

    $ component install pazguille/sticky

See: [https://github.com/component/component](https://github.com/component/component)

### Standalone
Also, you can use the script as a standalone, just copy index.js to sticky.js and include it:
```html
<script src="sticky.js"></script>
```

## How-to

```js
sticky( node, {

    // have a fixed header 100px tall? You want to set the top of sticky elements to that, default: 0
    top: 100,
    
    // you can configure that base z-index for elements that are stuck, default: 0   
    zIndexBase: 100,

    // want to handle the z-index yourself? Just set this to false, default: true   
    zIndexManagement: false,

    // you can configure the classname added to the sticky element, default: sticky-js-fixed
    className: 'my-sticky',

    // we add a placeholder element to keep page height sane, you can control the classname of that element, default: sticky-js-placeholder
    placeholderClassName: 'sticky-placeholder',

    // you can get a callback when an element is stuck
    stuck: function( element ) {
        console.log( 'The element was stuck!' );
    },
    
    // ... and a callback when an element is unstuck
    unstuck: function( element ) {
    
    }
});
```

```js
// makes all elements with the data-sticky attribute sticky, but uses default options
sticky();
```

```js
// makes all data-sticky elements sticky, but you can specify options
sticky( null, {
    top: 100,
    ...
});
```

## API

### sticky([el], [options])
Elements stick to the top of the viewport when the user scrolls down.
- `el`: (node || nodeList) [optional] A given node or nodeList.
- `options.top`: (number) [optional] Pixels from the top of the window to stick the element. [default: 0]
- `options.zIndexBase`: (number) [optional] Base z-index to use for dynamically controlled indexes. [default: 0]
- `options.zIndexManagement`: (boolean) [optional] Determines if z-index of sticky elements is changed when stuck/unstuck. [default: true]
- `options.className`: (string) [optional] Sets the class name added to elements that are stuck. [default: sticky-js-fixed]
- `options.placeholderClassName`: (string) [optional] Sets the class name for placeholder elements. [default: sticky-js-placeholder]
- `options.stuck`: (function) [optional] Callback function for when an element is stuck.
- `options.unstuck`: (function) [optional] Callback function for when an element is unstuck.

### sticky.destroy(el)
Elements stick to the top of the viewport when the user scrolls down.
- `el`: (node) A given node.

```js
sticky.destroy(node);
```

## Contact
- Guillermo Paz (Frontend developer - JavaScript developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

## License
Copyright (c) 2013 [@pazguille](http://twitter.com/pazguille) Licensed under the MIT license.
