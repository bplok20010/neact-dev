/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');
var is = require('./is');
var DOMApi = require('./dom');
var NeactRefsMixin = require('./NeactRefsMixin');
var eProps = require('./NeactElementProperty');

var svgNS = 'http://www.w3.org/2000/svg';

var EMPTY_OBJ = {};

function NeactDOMComponent(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;
    this.dom = instance;
    this._instance.__instanceComponent = this;
}
util.assign(NeactDOMComponent.prototype, NeactRefsMixin, {
    _isComponent: true,
    _unmounted: true,
    _isDOMComponent: true,
    _getInstance: function() {
        var el,
            isSvg = this._currentElement.isSvg;
        if (isSvg) {
            el = document.createElementNS(svgNS, this.type);
        } else {
            el = document.createElement(this.type);
        }
        //ie8 input type只读
        if (this.type === 'input' && this.props.type) {
            el.type = this.props.type;
        }

        this._eventHandlers = {};

        this._events = {};

        return el;
    },

    getPublicInstance: function() {
        return this._instance;
    },

    render: function() {
        var childs = this._currentElement.props.children;

        if (is.array(childs)) {
            childs = util.flatten(childs);
        }
        return childs;

    },
    getDOM: function() {
        return this.dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    },
    patchProps: function(lastProps, nextProps, dom, isSVG) {
        lastProps = lastProps || EMPTY_OBJ;
        nextProps = nextProps || EMPTY_OBJ;

        var protectedProps = {
            children: true,
            key: true,
            ref: true,
            onComponentWillMount: true,
            onComponentDidMount: true,
            onComponentWillUpdate: true,
            onComponentDidUpdate: true,
            onComponentWillUnmount: true
        };

        if (nextProps !== EMPTY_OBJ) {
            for (var prop in nextProps) {
                if (protectedProps[prop]) continue;
                // do not add a hasOwnProperty check here, it affects performance
                var nextValue = nextProps[prop];
                var lastValue = lastProps[prop];

                if (is.undef(nextValue)) {
                    this.removeProp(prop, nextValue, dom);
                } else {
                    this.patchProp(prop, lastValue, nextValue, dom, isSVG);
                }
            }
        }
        if (lastProps !== EMPTY_OBJ) {
            for (var prop in lastProps) {
                if (protectedProps[prop]) continue;
                // do not add a hasOwnProperty check here, it affects performance
                if (is.undef(nextProps[prop])) {
                    this.removeProp(prop, lastProps[prop], dom);
                }
            }
        }
    },
    patchProp: function(prop, lastValue, nextValue, dom, isSVG) {
        if (eProps.skipProps[prop]) {
            return;
        }
        if (eProps.booleanProps[prop]) {
            dom[prop] = nextValue ? true : false;
        } else if (eProps.strictProps[prop]) {
            var value = is.undef(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
        } else if (lastValue !== nextValue) {
            if (is.attrEvent(prop)) {
                this.patchEvent(prop, lastValue, nextValue, dom);
            } else if (is.undef(nextValue)) {
                dom.removeAttribute(prop);
            } else if (prop === 'className') {
                if (isSVG) {
                    dom.setAttribute('class', nextValue);
                } else {
                    dom.className = nextValue;
                }
            } else if (prop === 'style') {
                this.patchStyle(lastValue, nextValue, dom);
            } else if (prop === 'dangerouslySetInnerHTML') {
                var lastHtml = lastValue && lastValue.__html;
                var nextHtml = nextValue && nextValue.__html;

                if (lastHtml !== nextHtml) {
                    if (!is.undef(nextHtml)) {
                        dom.innerHTML = nextHtml;
                    }
                }
            } else if (prop !== 'ref' && prop !== 'key') {
                var dehyphenProp;
                if (eProps.dehyphenProps[prop]) {
                    dehyphenProp = eProps.dehyphenProps[prop];
                } else if (isSVG && prop.match(eProps.probablyKebabProps)) {
                    dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, eProps.kebabize);
                    eProps.dehyphenProps[prop] = dehyphenProp;
                } else {
                    dehyphenProp = prop;
                }
                var ns = eProps.namespaces[prop];

                if (ns) {
                    dom.setAttributeNS(ns, dehyphenProp, nextValue);
                } else {
                    dom.setAttribute(dehyphenProp, nextValue);
                }

            }
        }
    },
    removeProp: function(prop, lastValue, dom) {
        if (prop === 'className') {
            dom.removeAttribute('class');
        } else if (prop === 'value') {
            dom.value = '';
        } else if (prop === 'style') {
            dom.removeAttribute('style');
        } else if (is.attrEvent(prop)) {
            this.removeEvent(prop, dom);
        } else {
            dom.removeAttribute(prop);
        }
    },
    patchStyle: function(oldStyle, style, dom) {
        if (is.string(style)) {
            dom.style.cssText = style;
            return;
        }

        var cur;

        if (!oldStyle && !style) return;
        oldStyle = oldStyle || {};
        style = style || {};

        for (name in oldStyle) {
            if (!style[name]) {
                dom.style[name] = '';
            }
        }
        for (name in style) {
            cur = style[name];
            if (cur !== oldStyle[name]) {
                dom.style[name] = cur;
            }
        }
    },
    patchEvent: function(name, lastValue, nextValue, dom) {
        if (lastValue === nextValue) return;
        var self = this,
            handlers = self._eventHandlers,
            events = self._events;

        name = name.toLowerCase();

        events[name] = nextValue;

        if (!handlers[name]) {
            handlers[name] = function(e) {
                events[name](e);
            }

            DOMApi.addEventListener(dom, name.replace('on', ''), handlers[name]);
        }
    },

    removeEvent: function(name, dom) {
        var self = this,
            handlers = self._eventHandlers,
            events = self._events;

        name = name.toLowerCase();

        if (handlers[name]) {
            DOMApi.removeEventListener(dom, name.replace('on', ''), handlers[name]);
            delete handlers[name];
            delete events[name];
        }
    },
    componentWillMount: function() {
        var props = this.props;
        if (props.onComponentWillMount) {
            props.onComponentWillMount(this._currentElement);
        }
    },
    componentDidMount: function() {
        var dom = this.dom;
        var vnode = this._currentElement;

        this.patchProps(null, this.props, dom, vnode.isSvg);

        var props = this.props;
        if (props.onComponentDidMount) {
            props.onComponentDidMount(dom, vnode);
        }
    },
    componentWillUpdate: function(nextProps) {
        var dom = this.dom;
        var prevProps = this.props;
        var vnode = this._currentElement;

        if (prevProps !== nextProps) {
            this.patchProps(prevProps, nextProps, dom, vnode.isSvg);
        }

        var props = nextProps;
        if (props.onComponentWillUpdate) {
            props.onComponentWillUpdate(dom, vnode);
        }
    },
    componentDidUpdate: function(prevProps) {
        var dom = this.dom;
        var vnode = this._currentElement;
        var props = this.props;
        if (props.onComponentDidUpdate) {
            props.onComponentDidUpdate(dom, vnode);
        }
    },
    componentWillUnmount: function() {
        var dom = this.dom;
        var props = this.props;
        var vnode = this._currentElement,
            handlers = this._eventHandlers;

        for (var name in handlers) {
            this.removeEvent(name, dom);
        }

        if (props.onComponentWillUnmount) {
            props.onComponentWillUnmount(dom, vnode);
        }
    }
});

module.exports = NeactDOMComponent;