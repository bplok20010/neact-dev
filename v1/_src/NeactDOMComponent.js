/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
//var NeactElement = require('./NeactElement');
var DOMApi = require('./dom');
//var BaseCompositeComponent = require('./Component');
var eProps = require('./elementProperty');

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
    //this.elm = instance;
    this.dom = instance;
}
util.assign(NeactDOMComponent.prototype, {
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

        this._eventHandlers = {};

        this._events = {};

        //this.patchProps(null, this.props, el, isSvg);
        return el;
    },
    render: function() {
        var childs = this._currentElement.props.children;

        //if (1) {
        if (is.array(childs)) {
            childs = util.flatten(childs);
        }
        return childs;
        //}
        /*
        if (is.array(childs)) {
            childs = util.map(util.flatten(childs), function(node) {
                if (is.primitive(node)) {
                    return vnode.createTextElement(node);
                }
                return node;
            });

            childs = util.filter(childs, function(node) {
                return !is.invalid(node);
            });

        } else {
            if (is.primitive(childs)) {
                childs = vnode.createTextElement(childs);
            }
        }
        return childs;
        */
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

        if (nextProps !== EMPTY_OBJ) {
            for (var prop in nextProps) {
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
            } else if (prop !== 'childrenType' && prop !== 'ref' && prop !== 'key') {
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
            this.removeEvent(prop, lastValue, dom);
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
    //patchEvents: function() {},
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

    removeEvent: function(name, value, dom) {
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
    componentDidMount: function() {
        var dom = this.getDOM();
        var isSvg = this._currentElement.isSvg;
        this.patchProps(null, this.props, dom, isSvg);
    },
    componentWillUpdate: function(nextProps) {
        var dom = this.getDOM();
        var prevProps = this.props;
        var isSvg = this._currentElement.isSvg;
        if (prevProps !== nextProps) {
            this.patchProps(prevProps, nextProps, dom, isSvg);
        }
    },
    componentDidUpdate: function(prevProps) {},
    componentWillUnmount: function() {
        var dom = this.dom;
        var props = this.props;

        for (var name in props) {
            // do not add a hasOwnProperty check here, it affects performance
            if (is.attrEvent(name)) {
                this.removeEvent(name, props[name], dom);
            }
        }
    }
});

module.exports = NeactDOMComponent;