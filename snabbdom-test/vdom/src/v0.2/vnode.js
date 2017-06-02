'use strict';

var is = require('./is');
var util = require('./util');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var E_TYPE = '_VDOM_';

var protectedProps = {
    key: true,
    ref: true
};

var element = function(type, key, props, ref) {
    var element = {
        $$typeof: E_TYPE,
        type: type,
        key: key,
        ref: ref,
        props: props
    };

    return element;
};

var createElement = function(type, config, children) {
    var propName;

    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (is.def(config)) {
        if (is.def(config.ref)) {
            ref = config.ref;
        }
        if (is.def(config.key)) {
            key = '' + config.key;
        }

        for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !protectedProps.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        props.children = children;
    } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
    }

    if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }

    return element(type, key, props, ref);
};

var createFactory = function(type) {
    var factory = util.bind(createElement, null, type);
    factory.type = type;
    return factory;
};

function createTextElement(text) {
    var vnode = createElement('#text', { text: text });
    return vnode;
}

var isValidElement = function(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === E_TYPE;
};

module.exports = {
    createElement: createElement,
    createTextElement: createTextElement,
    createFactory: createFactory,
    isValidElement: isValidElement
};