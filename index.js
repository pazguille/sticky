(function( window ) {

'use strict';

/**
 * Module dependencies.
 */
var win = window,
    doc = win.document,
    docEl = doc.documentElement,
    on = win.addEventListener || win.attachEvent,
    SCROLL = (on === win.attachEvent) ? 'onscroll' : 'scroll',
    zIndexOffset = 0,
    requestAnimFrame = (function () {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            function (callback) {
                win.setTimeout(callback, 1000 / 60);
            };
    }());

var defaultOptions = {
    zIndexBase: 0,
    zIndexManagement: true,
    className: 'sticky-js-fixed',
    placeholderClassName: 'sticky-js-placeholder',
    top: 0,
    stuck: null,
    unstuck: null
}

// https://github.com/gorillatron/extend
function _extend( deep ) {
  var out, objs, i, obj, prop, val

  out = {}

  typeof deep === "boolean" ? ( objs = [].slice.call(arguments, 1), deep = deep ) :
                              ( objs = [].slice.call(arguments, 0), deep = false )

  for( i = 0; i < objs.length; i++ ) {

    obj = objs[ i ]

    for( prop in obj ) {
      val = obj[ prop ]
      if( deep && typeof val === "object" && typeof out[prop] === "object") {
        out[ prop ] = _extend( out[prop], val )
      } else {
        out[ prop ] = val
      }
      
    }
  }

  return out
}

function checkPosition( sticky ) {
    var offsetTop = sticky.el.getBoundingClientRect().top;

    if ( !sticky.fixed && offsetTop <= sticky.options.top )
    {
        if ( !sticky.placeholder )
        {
            // insert a placeholder element into the dom so document height remains the same
            sticky.placeholder = doc.createElement( 'div' );
            sticky.placeholder.className = sticky.options.placeholderClassName;
            sticky.placeholder.style.height = sticky.el.offsetHeight + 'px';
            sticky.placeholder.style.position = 'relative';
            sticky.el.nextElementSibling ? sticky.el.parentNode.insertBefore( sticky.placeholder, sticky.el.nextElementSibling ) : sticky.el.parentNode.appendChild( sticky.placeholder );
        }
        else
        {
            sticky.placeholder.style.display = 'block';
        }

        sticky.el.style.top = sticky.options.top + 'px';
        sticky.el.className = sticky.el.className + ' ' + sticky.options.className;
        if ( sticky.options.zIndexManagement )
        {
            sticky.el.style.zIndex = sticky.options.zIndexBase + zIndexOffset++;
        }
        sticky.fixed = true;

        if ( sticky.options.stuck )
        {
            win.setTimeout( function () {
                sticky.options.stuck.call( sticky.el );
            }, 0 );
        }
    }
    else if ( sticky.fixed )
    {
        var originalTop = sticky.el.parentElement ? sticky.el.parentElement.getBoundingClientRect().top : 0;
        
        if ( sticky.el.previousElementSibling )
        {
            originalTop = sticky.el.previousElementSibling.getBoundingClientRect().top + sticky.el.previousElementSibling.getBoundingClientRect().height;
        }
        
        if ( originalTop > sticky.options.top )
        {
            sticky.el.style.top = sticky.originalTop;
            sticky.el.className = sticky.el.className.replace( ' ' + sticky.options.className, '' );
            if ( sticky.options.zIndexManagement )
            {
                sticky.el.style.zIndex = sticky.originalZindex;
            }
            sticky.fixed = false;
            if ( sticky.placeholder )
            {
                sticky.placeholder.style.display = 'none';
            }

            if ( sticky.options.unstuck )
            {
                win.setTimeout( function () {
                    sticky.options.unstuck.call( sticky.el );
                }, 0 );
            }
        }
    }
}

function update( sticky ) {
    sticky.collection.forEach( checkPosition );
}

/**
 * Sticky Class
 */
function Sticky( el, opts ) {

    if ( el === undefined )
    {
        throw new Error( '"sticky( el[, options] )": No element passed.' );
    }

    this.el = el;
    this.options = _extend( true, defaultOptions, opts );
    this.fixed = false;
    this.originalZindex = this.el.style.zIndex;
    this.originalTop = this.el.style.top;

    return this;
}

Sticky.prototype.destroy = function () {
    this.el.className = this.el.className.replace( ' ' + this.options.className, '' );
    this.fixed = false;
    if ( this.placeholder )
    {
        this.el.parentNode.removeChild( this.placeholder );
        this.placeholder = null;
    }
};

/**
 * sticky factory
 */
function sticky( nodes, options ) {

    nodes = nodes || doc.querySelectorAll('[data-sticky]');

    if ( nodes.length === undefined )
    {
        nodes = [ nodes ];
    }

    var i = 0,
        len = nodes.length;

    for (i; i < len; i += 1)
    {
        sticky.collection.push( new Sticky( nodes[ i ], options ) );
    }

    return this;
}

sticky.collection = [];

sticky.destroy = function( node ) {

    var i = 0,
        len = sticky.collection.length,
        instance;

    for ( i; i < len; ++i )
    {
        instance = sticky.collection[ i ];

        if ( instance.el === node )
        {
            instance.destroy();
            sticky.collection.splice( i, 1 );
            return true;
        }
    }
    
    return false;
};

/**
 * Expose Sticky
 */
if ( typeof window.define === 'function' && window.define.amd !== undefined ) // AMD suppport
{
    window.define( 'sticky', [], function () {
        return sticky;
    } );
}
else if ( typeof module !== 'undefined' && module.exports !== undefined ) // CommonJS suppport
{
    module.exports = sticky;
}
else
{
    window.sticky = sticky;
}

/**
 * Events
 */
on( SCROLL, function () {
    update( sticky );
} );
 
} )( this );