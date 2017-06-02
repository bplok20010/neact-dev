/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var vnode = require('./vnode');
var BaseCompositeComponent = require('./Component');
var eProps = require('./elementProperty');

var EMPTY_OBJ = {};

function DOMComponent(element) {
    BaseCompositeComponent.call(this, element);
}
util.inherits(DOMComponent, BaseCompositeComponent, {
    _isDOMComponent: true,
    _getInstance: function() {
        var el = document.createElement(this.type);
        this.patchProps(null, this.props, el);
        return el;
    },
    render: function() {
        var childs = this._currentElement.props.children;
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
            const value = isNullOrUndef(nextValue) ? '' : nextValue;

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
                } else if (isSVG && prop.match(probablyKebabProps)) {
                    dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, kebabize);
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
            dom[prop.toLowerCase()] = null;
            //handleEvent(name, lastValue, null, dom);
        } else {
            dom.removeAttribute(prop);
        }
    },
    patchStyle: function(lastAttrValue, nextAttrValue, dom) {
        if (is.string(nextAttrValue)) {
            dom.style.cssText = nextAttrValue;
            return;
        }

        for (var style in nextAttrValue) {
            // do not add a hasOwnProperty check here, it affects performance
            var value = nextAttrValue[style];

            if (is.number(value) && !eProps.isUnitlessNumber[style]) {
                dom.style[style] = value + 'px';
            } else {
                dom.style[style] = value;
            }
        }

        if (!is.undef(lastAttrValue)) {
            for (var style in lastAttrValue) {
                if (is.undef(nextAttrValue[style])) {
                    dom.style[style] = '';
                }
            }
        }
    },
    patchEvents: function() {},
    patchEvent: function(name, lastValue, nextValue, dom) {
        dom[name.toLowerCase()] = nextValue;
    }

});

module.exports = DOMComponent;