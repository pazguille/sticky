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
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

function update() {
    // No changing, exit
    if (!scrolled) { return; }

    sticky.collection.forEach(checkPosition);

    // Change scroll status
    scrolled = false;
}

function checkPosition(sticky) {
    var offsetTop = sticky.el.getBoundingClientRect().top;

    if (!sticky.fixed && offsetTop <= 0) {

        sticky.el.style.top = sticky.boundary + 'px';
        sticky.el.className = sticky.el.className + ' fixed';

        sticky.fixed = true;

        if (sticky.fn) {
            setTimeout(function () {
                sticky.fn.call(sticky.el);
            }, 0);
        }
    }

    if (sticky.fixed && ((win.pageYOffset || docEl.scrollTop) + sticky.boundary) < sticky.originalOffsetTop) {
        sticky.el.className = sticky.el.className.replace(/fixed/, '');
        sticky.fixed = false;
    }
}

/**
 * sticky factory
 */
function sticky(nodes, options) {

    nodes = nodes || doc.querySelectorAll('[data-sticky]');

    if (nodes.length === undefined) {
         nodes = [nodes];
    }

    var i = 0,
        len = nodes.length,
        e;

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
 * Sticky Class
 */
function Sticky(el, options) {

    if (el === undefined) {
        throw new Error('"sticky(el, [options])": It must receive an element.');
    }

    this.initialize(el, options);

    return this;
};

Sticky.prototype.initialize = function (el, options) {

    options = options || {};

    if (typeof options === 'number') {
        var num = options;
        options = {
            'boundary': num
        };
    }

    if (typeof options === 'function') {
        var fn = options;
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
}

Sticky.prototype.wrap = function () {
    var parent = this.el.parentNode;

    this.wrapper = doc.createElement('div');

    this.wrapper.style.width = this.el.offsetWidth + 'px';
    this.wrapper.style.height = this.el.offsetHeight + 'px';
    this.wrapper.style.position = 'relative';
    this.wrapper.style.zIndex = (zIndex += 1);

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
    update();
}());