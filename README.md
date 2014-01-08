# Sticky JS

Elements stick to the top of the viewport when the user scrolls down.

## Installation

    $ component install pazguille/sticky

See: [https://github.com/component/component](https://github.com/component/component)

### Standalone
Also, you can use the standalone version:
```html
<script src="sticky.js"></script>
```

## How-to

```js
sticky(node, {
   boundary: 200,
   fn: function () {}
});
```

```js
sticky();
```

```js
sticky(node);
```

```js
sticky(node, 200);
```

```js
sticky(node, function () {});
```

## API

### sticky([el], [options])
Elements stick to the top of the viewport when the user scrolls down.
- `el`: (node || nodeList) [optional] A given node or nodeList.
- `options.boundary`: (number) [optional] Pixels from top of window to the element's top.
- `options.fn`: (function) [optional] Function to be executed when the element will be fixed.

```js
sticky(node, {
   boundary: 200,
   fn: function () {}
});
```

### sticky.destroy(el)
Elements stick to the top of the viewport when the user scrolls down.
- `el`: (node) A given node.

```js
sticky.destroy(node);
```

## Maintained by
- Guillermo Paz (Front-end developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

## License
Licensed under the MIT license.

Copyright (c) 2013 [@pazguille](http://twitter.com/pazguille).