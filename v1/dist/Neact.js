(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Neact = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var is = require('./is');
var util = require('./util');
var NeactElement = require('./NeactElement');
var NeactClass = require('./NeactClass');
var NeactMount = require('./NeactMount');
var NeactUnMount = require('./NeactUnMount');
var NeactComponent = require('./NeactComponent');
var NeactPureComponent = require('./NeactPureComponent');
var patch = require('./patch');
var shallowEqual = require('./shallowEqual');



var Neact = {
    createElement: NeactElement.createElement,
    createTextElement: NeactElement.createTextElement,
    createFactory: NeactElement.createFactory,
    isValidElement: NeactElement.isValidElement,
    createClass: NeactClass.createClass,
    Component: NeactComponent,
    PureComponent: NeactPureComponent,
    shallowEqual: shallowEqual,
    util: util,
    render: function(vnode, parentDOM) {
        if (!is.vnode(vnode)) return null;
        if (!parentDOM) return null;

        var lastInst = parentDOM.__NeactInstance;

        if (!lastInst) {
            var inst = parentDOM.__NeactInstance = NeactMount.mount(vnode, null, parentDOM, null);
            return inst._instance;
        }

        lastInst = parentDOM.__NeactInstance = patch.patchVnode(lastInst, vnode);

        return lastInst._instance;
    },
    findDOMNode: function(component) {
        return component._instanceCompositeComponent.getDOM();
    },
    unmountComponentAtNode: NeactUnMount.unmountComponentAtNode
};

module.exports = Neact;
},{"./NeactClass":2,"./NeactComponent":4,"./NeactElement":9,"./NeactMount":12,"./NeactPureComponent":13,"./NeactUnMount":15,"./is":18,"./patch":19,"./shallowEqual":20,"./util":21}],2:[function(require,module,exports){
'use strict';
var is = require('./is');
var util = require('./util');
var NeactClassMixin = require('./NeactClassMixin');

function ClassComponent(props, context) {}

util.assign(ClassComponent.prototype, NeactClassMixin);

module.exports = {
    createClass: function(spec) {
        function Constructor(props, context) {
            this.refs = {};
            this.props = props || {};
            this.context = context;
            this.state = null;

            if (this.construct) {
                this.construct(props, context);
                return;
            }

            var initialState = this.getInitialState ? this.getInitialState(this.props) : null;

            if (!(typeof initialState === 'object' && !is.array(initialState))) {
                new TypeError('getInitialState(): must return an object or null');
            }

            this.state = initialState;
        }

        util.inherits(Constructor, ClassComponent, spec);

        Constructor.prototype.constructor = Constructor;

        if (spec.getDefaultProps) {
            Constructor.defaultProps = spec.getDefaultProps();
        }

        if (!Constructor.prototype.render) {
            new TypeError('createClass(...): Class specification must implement a `render` method.');
        }

        return Constructor;
    }
};
},{"./NeactClassMixin":3,"./is":18,"./util":21}],3:[function(require,module,exports){
'use strict';

var util = require('./util');
var patch = require('./patch');

var NeactClassMixin = {
    setState: function(newState, callback) {
        var inst = this._instanceCompositeComponent;

        if (inst._unmounted) {
            return;
        }

        if (typeof newState === 'function') {
            newState = newState(this.state);
        }

        inst._nextState = util.assign({}, this.state || {}, newState || {});

        this.forceUpdate(callback);
    },
    forceUpdate: function(callback) {
        var inst = this._instanceCompositeComponent;

        if (inst._unmounted) {
            return;
        }

        patch.patchVnode(inst, inst._currentElement);

        if (callback) {
            callback();
        }
    },

    isMounted: function() {
        return !this._unmounted;
    },

    getInstance: function() {
        return this._instanceCompositeComponent;
    }
}

module.exports = NeactClassMixin;
},{"./patch":19,"./util":21}],4:[function(require,module,exports){
'use strict';

var util = require('./util');
var NeactClassMixin = require('./NeactClassMixin');

function NeactComponent(props, context) {
    this.props = props;
    this.context = context;
    this.refs = {};
    this.state = null;
}

util.assign(NeactComponent.prototype, NeactClassMixin);

module.exports = NeactComponent;
},{"./NeactClassMixin":3,"./util":21}],5:[function(require,module,exports){
/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');
var is = require('./is');
var NeactCurrentOwner = require('./NeactCurrentOwner');
var NeactRefsMixin = require('./NeactRefsMixin');

function NeactCompositeComponent(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;

    this.dom = null;
    this._instance._instanceCompositeComponent = this;
}

util.assign(NeactCompositeComponent.prototype, NeactRefsMixin, {
    _isComponent: true,
    _unmounted: true,
    _isCompositeComponent: true,
    _nextState: null,
    _getInstance: function() {
        var type = this.type;
        var props = this._currentElement.props;
        return new type(props);
    },

    getPublicInstance: function() {
        return this._instance;
    },

    getDOM: function() {
        var inst = this,
            dom = inst.dom;

        while (!dom && (inst = inst.children)) {
            dom = inst.dom;
        }

        return dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    },
    render: function() {

        NeactCurrentOwner.current = this;

        var childs = this._instance.render();

        NeactCurrentOwner.current = null;

        if (is.array(childs)) {
            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }

        return childs;
    },

    componentWillMount: function() {
        var vnode = this._instance;
        if (vnode.componentWillMount) {
            vnode.componentWillMount();
        }
    },

    componentDidMount: function() {
        var vnode = this._instance;

        if (vnode.componentDidMount) {
            vnode.componentDidMount();
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var vnode = this._instance;
        if (vnode.componentWillReceiveProps) {
            vnode.componentWillReceiveProps(nextProps);
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.shouldComponentUpdate) {
            return vnode.shouldComponentUpdate(nextProps, nextState);
        }

        return true;
    },
    componentWillUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.componentWillUpdate) {
            vnode.componentWillUpdate(nextProps, nextState);
        }
    },
    componentDidUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.componentDidUpdate) {
            vnode.componentDidUpdate(nextProps, nextState);
        }
    }
});

module.exports = NeactCompositeComponent;
},{"./NeactCurrentOwner":6,"./NeactRefsMixin":14,"./is":18,"./util":21}],6:[function(require,module,exports){
'use strict';

var NeactCurrentOwner = {
    current: null
};

module.exports = NeactCurrentOwner;
},{}],7:[function(require,module,exports){
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
},{"./NeactElementProperty":10,"./NeactRefsMixin":14,"./dom":16,"./is":18,"./util":21}],8:[function(require,module,exports){
/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');

function NeactTextDOMComponent(element) {
    this.text = element.props.text;
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    //this._instance = instance;
    ////this.elm = instance;
    this.dom = instance;
}
util.assign(NeactTextDOMComponent.prototype, {
    _isComponent: true,
    _unmounted: true,
    _isDOMTextComponent: true,
    _getInstance: function() {
        return document.createTextNode(this.text);
    },
    getDOM: function() {
        return this.dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    }
});

module.exports = NeactTextDOMComponent;
},{"./util":21}],9:[function(require,module,exports){
'use strict';

var is = require('./is');
var util = require('./util');
var NeactCurrentOwner = require('./NeactCurrentOwner');

var hasOwnProperty = Object.prototype.hasOwnProperty;

var E_TYPE = '_VNODE_';

var protectedProps = {
    key: true,
    ref: true
};

var element = function(type, key, props, ref, isSvg, owner) {
    var element = {
        $$typeof: E_TYPE,
        type: type,
        key: key,
        ref: ref,
        isSvg: isSvg,
        props: props,
        // Record the component responsible for creating this element.
        _owner: owner
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
    var isSvg = false;

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

    if (type && type[0] === 's' && type[1] === 'v' && type[2] === 'g') {
        isSvg = true;
    }

    return element(type, key, props, ref, isSvg, NeactCurrentOwner.current);
};

var createFactory = function(type) {
    var factory = util.bind(createElement, null, type);
    factory.type = type;
    return factory;
};

function createTextElement(text) {
    return element('#text', null, { text: text }, null, false, null);
}

function createVoidElement() {
    return element('#comment', null, {}, null, false, null);
}

var isValidElement = function(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === E_TYPE;
};

module.exports = {
    createElement: createElement,
    createTextElement: createTextElement,
    createVoidElement: createVoidElement,
    createFactory: createFactory,
    isValidElement: isValidElement
};
},{"./NeactCurrentOwner":6,"./is":18,"./util":21}],10:[function(require,module,exports){
'use strict';

function constructDefaults(string, object, value) {
    var props = string.split(',');
    for (var i = 0; i < props.length; i++) {
        object[props[i]] = value;
    }
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var svgNS = 'http://www.w3.org/2000/svg';
var strictProps = {};
var booleanProps = {};
var namespaces = {};
var isUnitlessNumber = {};
var skipProps = {};
var dehyphenProps = {
    httpEquiv: 'http-equiv',
    acceptCharset: 'accept-charset'
};
var probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;

function kebabize(str, smallLetter, largeLetter) {
    return smallLetter + '-' + largeLetter.toLowerCase();
}
var delegatedProps = {};

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,defaultValue,defaultChecked', strictProps, true);
constructDefaults('children,ref,key', skipProps, true);
//constructDefaults('children,ref,key,selected,checked,value,multiple', skipProps, true);
constructDefaults('onClick,onMouseDown,onMouseUp,onMouseMove,onSubmit,onDblClick,onKeyDown,onKeyUp,onKeyPress', delegatedProps, true);
constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);
constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

module.exports = {
    xlinkNS: xlinkNS,
    xmlNS: xmlNS,
    svgNS: svgNS,
    strictProps: strictProps,
    booleanProps: booleanProps,
    namespaces: namespaces,
    isUnitlessNumber: isUnitlessNumber,
    skipProps: skipProps,
    dehyphenProps: dehyphenProps,
    probablyKebabProps: probablyKebabProps,
    kebabize: kebabize,
    delegatedProps: delegatedProps
};
},{}],11:[function(require,module,exports){
/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');
var is = require('./is');

function NeactEmptyComponent(element) {
    this.props = {};
    this._currentElement = null;
    var instance = this._getInstance();
    //this.elm = instance;
    this.dom = instance;
}

util.assign(NeactEmptyComponent.prototype, {
    _isComponent: true,
    _unmounted: true,
    _isEmptyComponent: true,
    _getInstance: function() {
        return document.createComment('empty-node');
    },
    getDOM: function() {
        return this.dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    }
});

module.exports = NeactEmptyComponent;
},{"./is":18,"./util":21}],12:[function(require,module,exports){
'use strict';

var is = require('./is');
var util = require('./util');
var DOMApi = require('./dom');
var instantiateComponent = require('./instantiateNeactComponent');

function mountInstance(inst, parentDOM, insertedVnodeQueue) {
    var i, dom = inst.dom,
        children = inst.children;

    if (is.compositeComponent(inst)) {
        insertedVnodeQueue.push(inst);
        if (!is.invalid(children)) {
            mountInstance(children, parentDOM, insertedVnodeQueue);
        }
    } else {
        if (parentDOM) {
            DOMApi.appendChild(parentDOM, dom);
        }
        //设置元素属性时，元素必须append到document中，不然有些参数会无效 eg.ie8下 img.width img.height 
        if (is.domComponent(inst)) {
            //DOM先调用componentDidMount 后才能再mount children
            inst.componentDidMount();
        }

        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                if (!is.invalid(children[i])) {
                    mountInstance(children[i], dom, insertedVnodeQueue);
                }
            }
        } else if (!is.invalid(children)) {
            mountInstance(children, dom, insertedVnodeQueue);
        }

    }

    if (is.compositeComponent(inst) || is.domComponent(inst)) {
        inst._attachRef();
    }

    return inst;
}

function mount(vnode, parentInst, parentDOM, before) {
    var i, dom;
    var insertedVnodeQueue = [];
    var inst = mountInstance(instantiateComponent(vnode, parentInst), parentDOM, insertedVnodeQueue);

    dom = inst.getDOM();

    //防止null 
    if (parentDOM && dom) {
        DOMApi.insertBefore(parentDOM, dom, before);
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].componentDidMount();
    }

    return inst;
}

module.exports = {
    mount: mount,
    render: function(vnode, parentDOM) {
        if (!is.vnode(vnode)) return null;
        if (!parentDOM) return null;
        var inst = parentDOM.__NeactInstance = mount(vnode, null, parentDOM, null);
        return inst._instance;
    }
};
},{"./dom":16,"./instantiateNeactComponent":17,"./is":18,"./util":21}],13:[function(require,module,exports){
'use strict';

var util = require('./util');
var NeactComponent = require('./NeactComponent');

function NeactPureComponent(props, context) {
    this.props = props;
    this.context = context;
    this.refs = {};
    this.state = null;
}

function ComponentDummy() {}
ComponentDummy.prototype = NeactComponent.prototype;
NeactPureComponent.prototype = new ComponentDummy();
NeactPureComponent.prototype.constructor = NeactPureComponent;

NeactPureComponent.prototype.isPureNeactComponent = true;

module.exports = NeactPureComponent;
},{"./NeactComponent":4,"./util":21}],14:[function(require,module,exports){
/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */

'use strict';

var NeactRefsMixin = {
    shouldUpdateRefs: function(nextElement) {
        var prevElement = this._currentElement;
        var prevRef = null;
        var prevOwner = null;
        if (prevElement !== null && typeof prevElement === 'object') {
            prevRef = prevElement.ref;
            prevOwner = prevElement._owner;
        }

        var nextRef = null;
        var nextOwner = null;
        if (nextElement !== null && typeof nextElement === 'object') {
            nextRef = nextElement.ref;
            nextOwner = nextElement._owner;
        }

        return prevRef !== nextRef ||
            // If owner changes but we have an unchanged function ref, don't update refs
            typeof nextRef === 'string' && nextOwner !== prevOwner;
    },

    _attachRef: function() {
        var element = this._currentElement;
        var owner = element._owner;
        var ref = element.ref;
        if (ref && owner) {
            owner.attachRef(ref, this);
        }
    },

    attachRef: function(ref, component) {
        var vnode = this._instance;
        var refs = vnode.refs;
        if (typeof ref === 'function') {
            ref(component._instance);
        } else {
            refs[ref] = component._instance;
        }
    },

    _detachRef: function() {
        var element = this._currentElement;
        var owner = element._owner;
        var ref = element.ref;
        if (ref && owner) {
            owner.detachRef(ref);
        }
    },

    detachRef: function(ref) {
        var vnode = this._instance;
        var refs = vnode.refs;
        if (typeof ref === 'function') {
            ref(null);
        } else {
            delete refs[ref];
        }
    }
};

module.exports = NeactRefsMixin;
},{}],15:[function(require,module,exports){
'use strict';

var is = require('./is');
var util = require('./util');
var DOMApi = require('./dom');

function unmount(inst, parentDom) {
    if (inst._isCompositeComponent) {
        unmountComponent(inst, parentDom);
    } else if (inst._isDOMComponent) {
        unmountElement(inst, parentDom);
    } else if (inst._isDOMTextComponent || inst._isEmptyComponent) {
        unmountText(inst, parentDom);
    }
}

function unmountComponent(inst, parentDom) {
    var children = inst.children;
    var instance = inst._instance;
    var dom = inst.getDOM();

    if (!inst._unmounted) {
        instance.componentWillUnmount && instance.componentWillUnmount();
        instance._unmounted = inst._unmounted = true;

        //detachRef(inst);
        inst._detachRef();

        if (children) {
            unmount(children, null);
        }
    }

    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountElement(inst, parentDom) {
    var dom = inst.dom;
    var props = inst.props;

    if (!inst._unmounted) {
        inst.componentWillUnmount();
        inst._unmounted = true;

        //detachRef(inst);
        inst._detachRef();
    }

    unmountChildren(inst.children);

    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountText(inst, parentDom) {
    if (parentDom) {
        DOMApi.removeChild(parentDom, inst.dom);
    }
}

function unmountChildren(children) {
    if (is.array(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!is.invalid(child) && is.object(child)) {
                unmount(child, null);
            }
        }
    } else if (is.object(children)) {
        unmount(children, null);
    }
}

function unmountComponentAtNode(dom) {
    if (dom.__NeactInstance) {
        unmount(dom.__NeactInstance, dom);
        delete dom.__NeactInstance;
    }
}

module.exports = {
    unmountComponentAtNode: unmountComponentAtNode,
    unmount: function(inst) {
        unmount(inst, inst.getParentDOM());
    }
};
},{"./dom":16,"./is":18,"./util":21}],16:[function(require,module,exports){
function createElement(tagName) {
    return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text) {
    return document.createTextNode(text);
}


function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}


function removeChild(node, child) {
    node.removeChild(child);
}

function appendChild(node, child) {
    node.appendChild(child);
}

function parentNode(node) {
    return node.parentElement;
}

function nextSibling(node) {
    return node.nextSibling;
}

function tagName(node) {
    return node.tagName;
}

function setTextContent(node, text) {
    if (node.nodeType === 3) {
        node.data = text;
    } else {
        if ('textContent' in node) {
            node.textContent = text;
        } else {
            node.innerText = text;
        }
    }
}

function addEventListener(node, name, fn) {
    if (typeof node.addEventListener == "function")
        node.addEventListener(name, fn, false);
    else if (typeof node.attachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.attachEvent(attachEventName, fn);
    }
}

function removeEventListener(node, name, fn) {
    if (typeof node.removeEventListener == "function")
        node.removeEventListener(name, fn, false);
    else if (typeof node.detachEvent != "undefined") {
        var attachEventName = "on" + name;
        node.detachEvent(attachEventName, fn);
    }
}

module.exports = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    appendChild: appendChild,
    removeChild: removeChild,
    insertBefore: insertBefore,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};
},{}],17:[function(require,module,exports){
var is = require('./is');
var util = require('./util');
var createTextElement = require('./NeactElement').createTextElement;
var createVoidElement = require('./NeactElement').createVoidElement;
var NeactDOMComponent = require('./NeactDOMComponent');
var NeactDOMTextComponent = require('./NeactDOMTextComponent');
var NeactCompositeComponent = require('./NeactCompositeComponent');
var NeactEmptyComponent = require('./NeactEmptyComponent');

function createComponent(element) {
    var instance;
    //if (typeof element === 'object' && element._instance) {
    //    return element;
    //}

    if (is.invalid(element) || is.invalidElement(element)) {
        instance = new NeactEmptyComponent();
    } else if (is.textElement(element) || is.primitive(element)) {
        instance = new NeactDOMTextComponent(element);
    } else if (is.compositeElement(element)) {
        instance = new NeactCompositeComponent(element);
    } else if (typeof element.type === 'string') {
        instance = new NeactDOMComponent(element);
    } else {
        throw new TypeError('unknow error')
    }

    return instance;
}
/**
 * 确保vnode 经过invalid处理
 */
function instantiateComponent(vnode, parentVnode) {
    //if (is.primitive(vnode)) {
    //    vnode = element.createTextElement(vnode);
    //}

    var inst = createComponent(vnode);

    inst.parentNode = parentVnode || null;

    inst._unmounted = false;

    if (is.compositeComponent(inst) || is.domComponent(inst)) {
        inst.componentWillMount();
    }

    if (is.emptyComponent(inst) || is.domTextComponent(inst)) {
        return inst;
    }

    var isSvg = vnode.isSvg;

    var childs = inst.render();

    if (is.compositeComponent(inst)) {
        if (is.primitive(childs)) {
            childs = createTextElement(childs);
        } else if (is.invalid(childs)) {
            childs = createVoidElement();
        }
        inst.children = instantiateComponent(childs, inst);
    } else {

        if (is.array(childs)) {
            var renderChilds = [];
            for (var i = 0; i < childs.length; i++) {
                var node = childs[i];
                if (is.invalid(node)) continue;
                if (is.primitive(node)) {
                    node = createTextElement(node);
                }
                node.isSvg = isSvg;
                renderChilds.push(instantiateComponent(node, inst));
            }
            inst.children = renderChilds;
        } else if (!is.invalid(childs)) {
            if (is.primitive(childs)) {
                childs = createTextElement(childs);
            }
            childs.isSvg = isSvg;
            inst.children = instantiateComponent(childs, inst);
        }

    }

    return inst;
}

module.exports = instantiateComponent;
},{"./NeactCompositeComponent":5,"./NeactDOMComponent":7,"./NeactDOMTextComponent":8,"./NeactElement":9,"./NeactEmptyComponent":11,"./is":18,"./util":21}],18:[function(require,module,exports){
var objToString = Object.prototype.toString;
var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

module.exports = {
    array: isArray,
    string: function(obj) {
        return typeof obj === 'string';
    },
    number: function(obj) {
        return typeof obj === 'number';
    },
    'function': function(obj) {
        return typeof obj === 'function';
    },
    object: function(obj) {
        return typeof obj === 'object';
    },
    vtextnode: function(vnode) {
        return this.def(vnode.text);
    },
    attrEvent: function(attr) {
        return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
    },
    primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
    undef: function(s) {
        return s === undefined || s === null;
    },
    invalid: function(s) {
        return s === null || s === false || s === true || s === undefined;
    },
    def: function(s) {
        return s !== undefined && s !== null;
    },
    vnode: function(vnode) {
        return vnode && vnode.type;
    },
    textElement: function(element) {
        return element.type === '#text' && this.def(element.props.text);
    },
    invalidElement: function(element) {
        return element.type === '#comment';
    },
    compositeElement: function(element) {
        return typeof element.type === 'function';
    },
    domElement: function(element) {
        return !this.textElement(element) && !this.compositeElement(element) && typeof element.type === 'string';
    },
    component: function(inst) {
        return inst._isComponent;
    },
    compositeComponent: function(inst) {
        return inst._isCompositeComponent;
    },
    domComponent: function(inst) {
        return inst._isDOMComponent;
    },
    domTextComponent: function(inst) {
        return inst._isDOMTextComponent;
    },
    emptyComponent: function(inst) {
        return inst._isEmptyComponent;
    },
    dom: function(obj) {
        return obj && obj.nodeType === 1 &&
            typeof(obj.nodeName) == 'string';
    },
    textNode: function(obj) {
        return obj.nodeType === 3;
    },
    sameVnode: function(inst, vnode) {
        if (this.emptyComponent(inst)) {
            if (this.invalid(vnode)) return true;
            else return false;
        } else if (this.invalid(vnode)) {
            return false;
        }

        return inst.key === vnode.key && inst.type === vnode.type;
    }

};
},{}],19:[function(require,module,exports){
'use strict';
var is = require('./is');
var util = require('./util');
var api = require('./dom');
var mount = require('./NeactMount').mount;
var unmount = require('./NeactUnMount').unmount;
var createTextElement = require('./NeactElement').createTextElement;
var createVoidElement = require('./NeactElement').createVoidElement;
var shallowEqual = require('./shallowEqual');

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        if (is.invalid(children[i])) continue;
        key = children[i].key;
        if (is.def(key)) map[key] = i;
    }
    return map;
}

function unmountChildren(children, isRecycling) {
    if (is.component(children)) {
        unmount(children, isRecycling);
    } else if (is.array(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!is.invalid(child)) {
                unmount(child, isRecycling);
            }
        }
    }
}

function updateChildren(parentVnode, oldCh, newCh) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var parentElm = parentVnode.getDOM();

    var newChilds = Array(newCh.length);

    function getNextNewChild() {
        while (!newStartVnode && newStartIdx <= newEndIdx) {
            newStartVnode = newCh[++newStartIdx];
            newChilds[newStartIdx] = null;
        }

        return newStartVnode;
    }

    function getPrevNewChild() {
        while (!newEndVnode && newEndIdx >= newStartIdx) {
            newEndVnode = newCh[--newEndIdx];
            newChilds[newEndIdx] = null;
        }

        return newEndVnode;
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        //if (1) {

        if (is.invalid(newStartVnode)) {
            newStartVnode = getNextNewChild();
        }

        if (is.invalid(newEndVnode)) {
            newEndVnode = getPrevNewChild();
        }

        if (is.invalid(newStartVnode) || is.invalid(newEndVnode)) {
            break;
        }

        if (is.primitive(newStartVnode)) {
            newStartVnode = createTextElement(newStartVnode);
            newCh[newStartIdx] = newStartVnode;
        }

        if (is.primitive(newEndVnode)) {
            newEndVnode = createTextElement(newEndVnode);
            newCh[newEndIdx] = newEndVnode;
        }

        //}

        if (is.undef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (is.undef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (is.sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode);
            newChilds[newStartIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (is.sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode);
            newChilds[newEndIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode);
            api.insertBefore(parentElm, oldStartVnode.getDOM(), api.nextSibling(oldEndVnode.getDOM()));
            newChilds[newEndIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode);
            api.insertBefore(parentElm, oldEndVnode.getDOM(), oldStartVnode.getDOM());
            newChilds[newStartIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (is.undef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (is.undef(idxInOld) || is.undef(oldCh[idxInOld])) { // New element
                var vnode = mount(newCh[newStartIdx], parentVnode, parentElm, oldStartVnode.getDOM());
                newChilds[newStartIdx] = vnode;
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode);
                oldCh[idxInOld] = undefined;
                api.insertBefore(parentElm, elmToMove.getDOM(), oldStartVnode.getDOM());
                newChilds[newStartIdx] = elmToMove;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) { // New element
        before = is.undef(newChilds[newEndIdx + 1]) ? null : newChilds[newEndIdx + 1].getDOM();
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            if (!is.invalid(newCh[newStartIdx])) {
                if (is.primitive(newCh[newStartIdx])) {
                    newCh[newStartIdx] = createTextElement(newCh[newStartIdx]);
                }
                var vnode = mount(newCh[newStartIdx], parentVnode, parentElm, before);
                newChilds[newStartIdx] = vnode;
            } else {
                newChilds[newStartIdx] = null;
            }
        }
    } else if (newStartIdx > newEndIdx) { // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {
            var vnode = oldCh[oldStartIdx];
            if (vnode) {
                unmount(vnode);
            }
        }
    }

    parentVnode.children = newChilds;
}

function patchComponent(prevComponent, nextElement) {
    var prevElement = prevComponent._currentElement;
    var nextElement = nextElement;

    var prevProps = prevElement.props;
    var nextProps = nextElement.props;

    var prevState = prevComponent._instance.state;
    var nextState = prevComponent._nextState || prevState;

    var isPureNeactComponent = prevComponent._instance.isPureNeactComponent;

    var willReceive = false;

    if (prevElement !== nextElement) {
        willReceive = true;
    }

    if (willReceive) {
        prevComponent.componentWillReceiveProps(nextProps);
    }

    var shouldUpdate = true;

    prevComponent._nextState = null;

    if (!isPureNeactComponent) {
        shouldUpdate = prevComponent.shouldComponentUpdate(nextProps, nextState);
    } else {
        shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(prevState, nextState);
    }

    if (shouldUpdate === false) return;

    //onBeforeComponentUpdate
    var refsChanged = prevComponent.shouldUpdateRefs(nextElement);

    if (refsChanged) {
        prevComponent._detachRef();
    }

    prevComponent.componentWillUpdate(nextProps, nextState);

    var lastChildren = prevComponent.children;

    prevComponent._instance.state = nextState;
    prevComponent._instance.props = nextProps;
    prevComponent.key = nextElement.key;
    prevComponent.type = nextElement.type;
    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    if (refsChanged && nextElement && nextElement.ref != null) {
        prevComponent._attachRef();
    }

    var nextChildren = prevComponent.render();

    patchVnode(lastChildren, nextChildren);

    prevComponent.componentDidUpdate(prevProps, prevState);

}

function patchDOMComponent(prevComponent, nextElement) {
    var dom = prevComponent.getDOM();
    var lastChildren = prevComponent.children;
    var prevProps = prevComponent.props;
    var nextProps = nextElement.props;
    var parentDOM = dom;

    //onBeforeComponentUpdate
    var refsChanged = prevComponent.shouldUpdateRefs(nextElement);

    if (refsChanged) {
        prevComponent._detachRef();
    }

    prevComponent.componentWillUpdate(nextProps, null);

    prevComponent.key = nextElement.key;
    prevComponent.type = nextElement.type;
    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    if (refsChanged && nextElement && nextElement.ref != null) {
        prevComponent._attachRef();
    }

    var nextChildren = prevComponent.render();

    //use invalid?
    if (is.def(lastChildren) && is.def(nextChildren)) {
        if (lastChildren !== nextChildren) {
            updateChildren(prevComponent, util.toArray(lastChildren), util.toArray(nextChildren));
        }
    } else if (is.def(nextChildren)) {
        nextChildren = util.toArray(nextChildren);
        var news = [];
        for (var i = 0; i < nextChildren.length; i++) {
            var child = nextChildren[i];
            //if (is.invalid(child)) continue;
            if (is.primitive(child)) {
                child = createTextElement(child);
            }
            var vnode = mount(child, prevComponent, parentDOM, null);
            news.push(vnode);
        }
        prevComponent.children = news;
    } else if (is.def(lastChildren)) {
        unmountChildren(lastChildren);
        prevComponent.children = null;
    }

    prevComponent.componentDidUpdate(prevProps, null);
}

function patchDOMTextComponent(prevComponent, nextElement) {
    var dom = prevComponent.getDOM();
    if (prevComponent.text !== nextElement.props.text) {
        api.setTextContent(dom, nextElement.props.text);
        prevComponent.props = nextElement.props;
        prevComponent.text = nextElement.props.text;
        prevComponent._currentElement = nextElement;
    }
}

function patchVnode(oldVnode, vnode) {
    if (is.invalid(vnode)) {
        return oldVnode;
    }
    if (!is.component(oldVnode)) {
        return null;
    }

    if (!is.sameVnode(oldVnode, vnode)) {
        var parentElm = oldVnode.getParentDOM(),
            elm = oldVnode.getDOM(),
            parentVnode = oldVnode.parentNode,
            nextElm = elm.nextSibling;
        unmount(oldVnode);
        var inst = mount(vnode, parentVnode, parentElm, nextElm);
        if (parentVnode) {
            parentVnode.children = inst;
        }
        return inst;
    }

    if (is.compositeComponent(oldVnode)) {
        patchComponent(oldVnode, vnode);
    } else if (is.domComponent(oldVnode)) {
        patchDOMComponent(oldVnode, vnode);
    } else if (is.domTextComponent(oldVnode)) {
        patchDOMTextComponent(oldVnode, vnode);
    }

    return oldVnode;
}


module.exports = {
    patchComponent: patchComponent,
    patchVnode: patchVnode,
    updateChildren: updateChildren
};
},{"./NeactElement":9,"./NeactMount":12,"./NeactUnMount":15,"./dom":16,"./is":18,"./shallowEqual":20,"./util":21}],20:[function(require,module,exports){
'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

module.exports = shallowEqual;
},{}],21:[function(require,module,exports){
/**
 * @author nobo (zere.nobo@gmail.com)
 * 
 */

'use strict';

var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;
var nativeFilter = ArrayProto.filter;

var objToString = Object.prototype.toString;

var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

/**
 * 构造类继承关系
 * @param {Function} cls 源类
 * @param {Function} base 基类
 */
function inherits(cls, base, proto) {
    var clsProto = cls.prototype;

    function F() {}
    F.prototype = base.prototype;
    cls.prototype = new F();

    if (proto) {
        for (var prop in proto) {
            cls.prototype[prop] = proto[prop];
        }
    }

    cls.constructor = cls;
}

function merge(target, source) {
    for (name in source) {
        if (source.hasOwnProperty(name)) {
            target[name] = source[name];
        }
    }
}

function copy(s) {
    if (isArray(s)) {
        s = [].concat(s);
    } else {
        s = merge({}, s);
    }
    return s;
}

/**
 * 数组或对象遍历
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

/**
 * 数组映射
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    } else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

/**
 * 数组过滤
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function filter(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.filter && obj.filter === nativeFilter) {
        return obj.filter(cb, context);
    } else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (cb.call(context, obj[i], i, obj)) {
                result.push(obj[i]);
            }
        }
        return result;
    }
}

function bind(func, context) {

    return function() {
        func.apply(context, arguments);
    }
}

var flatten = function(input) {
    var output = [],
        idx = 0;
    for (var i = 0, length = input && input.length; i < length; i++) {
        var value = input[i];
        if (isArray(value)) {
            value = flatten(value);
            var j = 0,
                len = value.length;
            output.length += len;
            while (j < len) {
                output[idx++] = value[j++];
            }
        } else {
            output[idx++] = value;
        }
    }
    return output;
};

function assign(target) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
};

function extendIf(obj, data) {
    var undef;
    for (var prop in data) {
        if (obj[prop] === undef) {
            obj[prop] = data[prop];
        }
    }
}

module.exports = {
    toArray: toArray,
    inherits: inherits,
    merge: merge,
    copy: copy,
    each: each,
    map: map,
    flatten: flatten,
    filter: filter,
    bind: bind,
    assign: assign,
    extendIf: extendIf
};
},{}]},{},[1])(1)
});