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

    // Change status
    scrolled = false;
}

function checkPosition(sticky) {
    var offsetTop = sticky.el.getBoundingClientRect().top;

    if (!(offsetTop >= (0 + sticky.boundary))) {
        sticky.el.style.top = sticky.boundary + 'px';
        sticky.el.className = 'fixed';

        sticky.fixed = true;

        if (sticky.fn) {
            setTimeout(function () {
                sticky.fn.call(sticky.el);
            }, 0);
        }
    }

    if (sticky.fixed && ((win.pageYOffset || docEl.scrollTop) + sticky.boundary) < sticky.originalOffsetTop) {
        sticky.el.className = '';
        sticky.fixed = false;
    }
}

/**
 * sticky factory
 */
function sticky(el, boundary, fn) {

    sticky.collection.push(new Sticky(el, boundary, fn));

    return this;
}

sticky.collection = []


/**
 * Sticky Class
 */
function Sticky(el, boundary, fn) {
   this.init(el, boundary, fn);

    return this;
};

Sticky.prototype.init = function (el, boundary, fn) {

    if (el === undefined) {return;}

    if (typeof boundary === 'function') {
        fn = boundary;
        boundary = 0;
    }

    this.el = el;
    this.boundary = boundary || 0;
    this.fn = fn;

    this.fixed = false;

    this.originalOffsetTop = this.el.getBoundingClientRect().top;

    this.wrap();

    return this;
}

Sticky.prototype.wrap = function () {
    var parent = this.el.parentNode,
        wrapper = doc.createElement('div');

    wrapper.style.width = this.el.offsetWidth + 'px';
    wrapper.style.height = this.el.offsetHeight + 'px';
    wrapper.style.position = 'relative';
    wrapper.style.zIndex = (zIndex += 1);

    parent.insertBefore(wrapper, this.el);
    wrapper.appendChild(this.el);

    return this;
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