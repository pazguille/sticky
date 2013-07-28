/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("sticky/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */
var win = window,
    doc = win.document,
    docEl = doc.documentElement,
    on = win.addEventListener || win.attachEvent,
    SCROLL = (on === win.attachEvent) ? 'onscroll' : 'scroll',
    scrolled = false,
    zIndex = 0,
    requestAnimFrame = (function () {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            function (callback) {
                win.setTimeout(callback, 1000 / 60);
            };
    }());

function checkPosition(sticky) {
    var offsetTop = sticky.el.getBoundingClientRect().top;

    if (!sticky.fixed && offsetTop <= 0) {

        sticky.el.style.top = sticky.boundary + 'px';
        sticky.el.className = sticky.el.className + ' fixed';

        sticky.fixed = true;

        if (sticky.fn) {
            win.setTimeout(function () {
                sticky.fn.call(sticky.el);
            }, 0);
        }
    }

    if (sticky.fixed && ((win.pageYOffset || docEl.scrollTop) + sticky.boundary) < sticky.originalOffsetTop) {
        sticky.el.className = sticky.el.className.replace(/fixed/, '');
        sticky.fixed = false;
    }
}

function update(sticky) {
    // No changing, exit
    if (!scrolled) { return; }

    sticky.collection.forEach(checkPosition);

    // Change scroll status
    scrolled = false;
}

/**
 * Sticky Class
 */
function Sticky(el, options) {

    if (el === undefined) {
        throw new Error('"sticky(el, [options])": It must receive an element.');
    }

    this.initialize(el, options);

    return this;
}

Sticky.prototype.initialize = function (el, options) {

    var num, fn;
    options = options || {};

    if (typeof options === 'number') {
        num = options;
        options = {
            'boundary': num
        };
    }

    if (typeof options === 'function') {
        fn = options;
        options = {
            'fn': fn
        };
    }

    // Config
    this.el = el;
    this.boundary = options.boundary || 0;
    this.fn = options.fn;

    // Defaults
    this.fixed = false;
    this.originalOffsetTop = this.el.getBoundingClientRect().top;

    this.wrap();

    return this;
};

Sticky.prototype.wrap = function () {
    var parent = this.el.parentNode;

    this.wrapper = doc.createElement('div');

    this.wrapper.style.width = this.el.offsetWidth + 'px';
    this.wrapper.style.height = this.el.offsetHeight + 'px';
    this.wrapper.style.position = 'relative';
    zIndex += 1;
    this.wrapper.style.zIndex = zIndex;

    parent.insertBefore(this.wrapper, this.el);
    this.wrapper.appendChild(this.el);

    return this;
};


Sticky.prototype.destroy = function () {
    var parent = this.wrapper.parentNode;

    this.el.className = this.el.className.replace(/fixed/, '');
    this.fixed = false;

    parent.insertBefore(this.el, this.wrapper);
    parent.removeChild(this.wrapper);
};

/**
 * sticky factory
 */
function sticky(nodes, options) {

    nodes = nodes || doc.querySelectorAll('[data-sticky]');

    if (nodes.length === undefined) {
        nodes = [nodes];
    }

    var i = 0,
        len = nodes.length;

    for (i; i < len; i += 1) {
        sticky.collection.push(new Sticky(nodes[i], options));
    }

    return this;
}

sticky.collection = [];

sticky.destroy = function (node) {

    var i = 0,
        len = sticky.collection.length,
        instance;

    for (i; i < len; i += 1) {
        instance = sticky.collection[i];

        if (instance.el === node) {
            instance.destroy();
            sticky.collection.splice(i, 1);
            return;
        }

    }
};

/**
 * Expose Sticky
 */
exports = module.exports = sticky;

/**
 * Events
 */
on(SCROLL, function () { scrolled = true; });

/**
 * requestAnimationFrame
 */
(function updateloop() {
    requestAnimFrame(updateloop);
    update(sticky);
}());
});
require.alias("sticky/index.js", "sticky/index.js");