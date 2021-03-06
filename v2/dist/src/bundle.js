var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeMap = ArrayProto.map;
var nativeFilter = ArrayProto.filter;

var objToString = Object.prototype.toString;

var emptyObject = {};

var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

function toArray(obj) {
    return isArray(obj) ? obj : [obj];
}

function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}

function isStringOrNumber(obj) {
    return isString(obj) || isNumber(obj);
}

function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}

function isInvalid(obj) {
    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isAttrAnEvent(attr) {
    return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isString(obj) {
    return typeof obj === 'string';
}

function isNumber(obj) {
    return typeof obj === 'number';
}

function isNull(obj) {
    return obj === null;
}

function isTrue(obj) {
    return obj === true;
}

function isUndefined(obj) {
    return obj === undefined;
}

function isDefined(obj) {
    return obj !== undefined;
}

function isObject(o) {
    return typeof o === 'object';
}

function isDOM(obj) {
    return obj && obj.nodeType === 1 &&
        typeof(obj.nodeName) == 'string';
}

function throwError(message) {
    if (!message) {
        message = 'a runtime error occured!';
    }
    throw new Error(`Neact Error: ${ message }`);
}

function warning(message) {
    console && console.warn(message);
}



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
    if (Object.assign) {
        return Object.assign.apply(Object, arguments);
    }

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
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);



var ieVersion = canUseDOM && document && (function() {
    var version = 3,
        div = document.createElement('div'),
        iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (
        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
        iElems[0]
    ) {}
    return version > 4 ? version : undefined;
}());

var isIE = !ieVersion;

let NeactCurrentOwner = {
    current: null
};

function normalizeVNodes(nodes, parentVNode) {
    let newNodes = [];

    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        if (isInvalid(n)) continue;
        if (isStringOrNumber(n)) {
            n = createTextVNode(n);
        }

        n.parentVNode = parentVNode;

        newNodes.push(n);
    }

    return newNodes.length > 0 ? newNodes : null;
}

function normalizeChildren(children, parentVNode) {
    if (isArray(children)) {
        return normalizeVNodes(children, parentVNode);
    } else if (isStringOrNumber(children)) {
        children = createTextVNode(children);
    }
    if (isVNode(children)) {
        children.parentVNode = parentVNode;
    }
    return children;
}

function normalize(vNode) {
    const isComponent = isComponentVNode(vNode);

    if (!isInvalid(vNode.children)) {
        vNode.children = normalizeChildren(vNode.children, isComponent ? null : vNode);
    }

    if (isComponent) {
        if (!vNode.props) {
            vNode.props = {};
        }
        vNode.props.children = vNode.children;
        vNode.children = null;
    }
}

function isVNode(VNode) {
    return VNode && isObject(VNode) && VNode.$$isVNode;
}

var isValidElement = isVNode;

function isSameVNode(vnode1, vnode2) {
    var isSame = vnode1.key === vnode2.key && vnode1.type === vnode2.type;
    if (isSame && isIE && ieVersion < 9 && vnode1.dom.tagName.toLowerCase() === 'input') {
        isSame = vnode1.props.type === vnode2.props.type;
    }
    return isSame;
}

function isVoidVNode(vNode) {
    return vNode.type === '#comment';
}

function isTextVNode(vNode) {
    return vNode.type === '#text';
}

function isElementVNode(vNode) {
    return isString(vNode.type) && vNode.type[0] !== '#';
}

function isComponentVNode(vNode) {
    return !isString(vNode.type); // && isFunction(vNode.type)
}

function createVNode(
    type,
    props,
    children,
    events,
    hooks,
    ref,
    key,
    isSVG,
    owner,
    noNormalise = false
) {
    var vNode = {
        $$isVNode: true,
        type: type,
        key: key === undefined ? null : key,
        ref: ref === undefined ? null : ref,
        props: props === undefined ? null : props,
        isSVG: isSVG === undefined ? null : isSVG,
        children: children === undefined ? null : children,
        parentVNode: null,
        events: events || null,
        hooks: hooks || null,
        dom: null,
        _owner: owner || null
    };

    if (!noNormalise) {
        normalize(vNode);
    }

    return vNode;
}

function createVoidVNode() {
    return createVNode('#comment');
}

const emptyVNode = createVoidVNode();



function createTextVNode(text) {
    return createVNode('#text', null, text, null, null, null, null, false, null, true);
}



function createElement(type, config, ..._children) {
    if (isInvalid(type) || isObject(type)) {
        throw new Error('Neact Error: createElement() type parameter cannot be undefined, null, false or true, It must be a string, class or function.');
    }

    let prop, children = flatten(_children),
        props = {},
        events = null,
        hooks = null,
        key = null,
        ref = null,
        isSVG = false;

    if (children.length === 1) {
        children = children[0];
    } else if (children.length === 0) {
        children = null;
    }

    if (!isNullOrUndef(config)) {
        for (prop in config) {
            //if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if (isAttrAnEvent(prop) && isString(type)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
            //}
        }
    }

    //ComponentClass ComponentFunction
    if (!isString(type)) {
        if (type.defaultProps) {
            let defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) { // && hasOwnProperty.call(defaultProps, prop)
                    props[prop] = defaultProps[prop];
                }
            }
        }
    }

    if (!children && props.children) {
        children = props.children;
    }

    //delete props.children;

    //props.children = children;

    if (type && type[0] === 's' && type[1] === 'v' && type[2] === 'g') {
        isSVG = true;
    }

    return createVNode(type, props, children, events, hooks, ref, key, isSVG, NeactCurrentOwner.current);
}

function cloneElement(element, config, ..._children) {
    if (isTextVNode(element)) {
        return createTextVNode(element.children);
    }
    if (isVoidVNode(element)) {
        return createVoidVNode();
    }
    let prop, children = flatten(_children),
        type = element.type,
        props = assign({}, element.props);

    if (children.length === 1) {
        children = children[0];
    } else if (children.length === 0) {
        children = null;
    }

    var key = element.key;
    var ref = element.ref;
    var hooks = element.hooks;
    var events = element.events;

    var owner = element._owner;

    if (!isNullOrUndef(config)) {
        for (prop in config) {
            // if (hasOwnProperty.call(config, prop)) {
            if (prop === 'key') {
                key = '' + config.key;
            } else if (prop === 'ref') {
                ref = '' + config.ref;
            } else if (prop === 'hooks') {
                hooks = config.hooks;
            } else if (isAttrAnEvent(prop) && isString(type)) {
                if (!events) {
                    events = {};
                }
                events[prop.toLowerCase()] = config[prop];
            } else {
                props[prop] = config[prop];
            }
            //}
        }
    }

    //ComponentClass ComponentFunction
    if (!isString(type)) {
        if (type.defaultProps) {
            let defaultProps = type.defaultProps;
            for (prop in defaultProps) {
                if (props[prop] === undefined) { //&& hasOwnProperty.call(defaultProps, prop)
                    props[prop] = defaultProps[prop];
                }
            }
        }
    }

    if (isNull(children)) {
        children = isComponentVNode(element) ? element.props.children : element.children;
    }

    //props.children = children;

    return createVNode(type, props, children, events, hooks, ref, key, element.isSVG, NeactCurrentOwner.current);
}

function CallbackQueue() {
    this.listeners = [];
}
CallbackQueue.prototype.enqueue = function(callback) {
    this.listeners.push(callback);
};

CallbackQueue.prototype.notifyAll = function() {
    for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i]();
    }
    this.listeners.length = 0;
};

function shouldUpdateRefs(lastVNode, nextVNode) {
    const lastRef = lastVNode.ref;
    const nextRef = nextVNode.ref;
    const lastOwner = lastVNode._owner;
    const nextOwner = nextVNode._owner;
    return lastRef !== nextRef ||
        typeof nextRef === 'string' && nextOwner !== lastOwner;
}

function detachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;

    if (typeof ref === 'function') {
        ref(null);
    } else if (ref && owner) {
        delete owner.refs[ref];
    }
}

function attachRef(vNode) {
    var ref = vNode.ref;
    var owner = vNode._owner;
    var target = vNode._instance || vNode.dom;

    if (typeof ref === 'function') {
        ref(target);
    } else if (ref && owner) {
        owner.refs[ref] = target;
    }
}

function ename(s) {
    return s.replace('on', '');
}

function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    } else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            } else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        } else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i], vnode, event);
            }
        }
    }
}

function handleEvent(event, vnode) {
    var name = 'on' + event.type,
        on = vnode.events;

    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}

function createListener() {
    return function handler(e) {
        e = e || event;
        handleEvent(e, handler.vnode);
    }
}

function createDOMEvents(vNode) {
    updateDOMEvents(emptyVNode, vNode);
}

function updateDOMEvents(oldVnode, vnode) {
    var oldOn = oldVnode.events,
        oldListener = oldVnode._listener,
        oldElm = oldVnode.dom,
        on = vnode && vnode.events,
        elm = vnode && vnode.dom,
        name;

    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }

    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                removeEventListener(oldElm, ename(name), oldListener);
            }
        } else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    removeEventListener(oldElm, ename(name), oldListener);
                }
            }
        }
    }

    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode._listener = oldVnode._listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;

        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                addEventListener(elm, ename(name), listener);
            }
        } else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    addEventListener(elm, ename(name), listener);
                }
            }
        }
    }
}

function destroyDOMEvents(vNode) {
    updateDOMEvents(vNode, emptyVNode);
}

function unmount(vNode, parentDom, callback) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        unmountElement(vNode, parentDom, callback);
    } else if (isVoidVNode(vNode) || isTextVNode(vNode)) {
        unmountVoidOrText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        unmountComponent(vNode, parentDom, callback);
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
}

function unmountVoidOrText(vNode, parentDom) {
    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }
}

function unmountElement(vNode, parentDom, callback) {
    const dom = vNode.dom;
    const events = vNode.events;
    const hooks = vNode.hooks || {};
    const children = vNode.children;

    if (!isNull(vNode.ref)) {
        detachRef(vNode);
    }

    destroyDOMEvents(vNode);

    if (parentDom) {
        removeChild(parentDom, dom);
    }

    if (!isNullOrUndef(children)) {
        unmountChildren(children, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

function unmountChildren(children, callback) {
    if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (!isInvalid(child) && isVNode(child)) {
                unmount(child, null, callback, );
            }
        }
    } else if (isVNode(children)) {
        unmount(children, null, callback);
    }
}

function unmountComponent(vNode, parentDom, callback) {
    const inst = vNode._instance;
    const isClass = isStatefulComponent(vNode.type);
    const children = vNode.children;
    const props = vNode.props;
    const hooks = vNode.hooks || {};
    const dom = vNode.dom;

    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }

    if (isClass) {
        if (!inst._unmounted) {
            inst._ignoreSetState = true;
            //TODO: beforeUnmount
            if (inst.componentWillUnmount) {
                inst.componentWillUnmount();
            }

            if (!isNull(vNode.ref)) {
                detachRef(vNode);
            }

            unmount(children, null, callback);

            inst._unmounted = true;
            inst._ignoreSetState = false;
        }
    } else {
        if (!isNullOrUndef(props.onComponentWillUnmount)) {
            props.onComponentWillUnmount(vNode);
        }

        unmount(children, null, callback);
    }

    if (hooks.destroy) {
        hooks.destroy(vNode);
    }
}

const svgNS = 'http://www.w3.org/2000/svg';

function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}

function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

function nextSibling(node) {
    return node.nextSibling;
}

function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}

function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    } else {
        return document.createElement(tag);
    }
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



function replaceWithNewNode(lastNode, nextNode, parentDom, callback, context, isSVG) {
    unmount(lastNode, null);
    const dom = mount(nextNode, null, callback, context, isSVG);

    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}

function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
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

function createNeactComponent(vNode, context, isSVG) {
    const type = vNode.type;
    const props = vNode.props || {};
    const ref = vNode.ref;

    if (isUndefined(context)) {
        context = {};
    }

    const inst = new type(props, context);

    inst.props = props;
    inst.context = context;
    inst.refs = emptyObject;

    var initialState = inst.state;
    if (initialState === undefined) {
        inst.state = initialState = null;
    }

    inst._unmounted = false;
    inst._isSVG = isSVG;

    const childContext = inst.getChildContext();

    if (!isNullOrUndef(childContext)) {
        inst._childContext = assign({}, context, childContext);
    } else {
        inst._childContext = context;
    }

    return inst;
}

function processElement(vNode, dom) {

}

let processDOMPropertyHooks = {

};

function constructDefaults(string, object, value) {
    var r = string.split(',');
    for (let i = 0; i < r.length; i++) {
        object[r[i]] = value;
    }
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';

const strictProps = {};
const booleanProps = {};
const namespaces = {};
const isUnitlessNumber = {};
const skipProps = {};
const dehyphenProps = {
    acceptCharset: 'accept-charset',
    httpEquiv: 'http-equiv',
    acceptCharset: 'accept-charset'
};
const probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;

function kebabize(str, smallLetter, largeLetter) {
    return `${smallLetter}-${largeLetter.toLowerCase()}`;
}

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,defaultValue,value', strictProps, true);
constructDefaults('children,ref,key', skipProps, true);

constructDefaults('muted,scoped,loop,open,checked,multiple,defaultChecked,selected,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);

constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

let hasShorthandPropertyBug = false;
let styleFloatAccessor = 'cssFloat';

if (canUseDOM) {
    let tempStyle = document.createElement('div').style;
    try {
        // IE8 throws "Invalid argument." if resetting shorthand style properties.
        tempStyle.font = '';
    } catch (e) {
        hasShorthandPropertyBug = true;
    }
    // IE8 only supports accessing cssFloat (standard) as styleFloat
    if (document.documentElement.style.cssFloat === undefined) {
        styleFloatAccessor = 'styleFloat';
    }
}
/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
const shorthandPropertyExpansions = {
    background: {
        backgroundAttachment: true,
        backgroundColor: true,
        backgroundImage: true,
        backgroundPositionX: true,
        backgroundPositionY: true,
        backgroundRepeat: true
    },
    backgroundPosition: {
        backgroundPositionX: true,
        backgroundPositionY: true
    },
    border: {
        borderWidth: true,
        borderStyle: true,
        borderColor: true
    },
    borderBottom: {
        borderBottomWidth: true,
        borderBottomStyle: true,
        borderBottomColor: true
    },
    borderLeft: {
        borderLeftWidth: true,
        borderLeftStyle: true,
        borderLeftColor: true
    },
    borderRight: {
        borderRightWidth: true,
        borderRightStyle: true,
        borderRightColor: true
    },
    borderTop: {
        borderTopWidth: true,
        borderTopStyle: true,
        borderTopColor: true
    },
    font: {
        fontStyle: true,
        fontVariant: true,
        fontWeight: true,
        fontSize: true,
        lineHeight: true,
        fontFamily: true
    },
    outline: {
        outlineWidth: true,
        outlineStyle: true,
        outlineColor: true
    }
};

var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
    nextFrame(function() { obj[prop] = val; });
}

var processDOMStyle = function(lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) return;
    if (isString(nextValue)) {
        dom.style.cssText = nextValue;
        return;
    }

    var cur, name, elm = dom,
        domStyle = dom.style,
        oldStyle = lastValue,
        style = nextValue;

    if (!oldStyle && !style) return;
    oldStyle = oldStyle || emptyObject;
    style = style || emptyObject;
    var oldHasDel = 'delayed' in oldStyle;

    for (name in oldStyle) {
        if (!style[name]) {
            let expansion = hasShorthandPropertyBug && shorthandPropertyExpansions[name];
            if (expansion) {
                // Shorthand property that IE8 won't like unsetting, so unset each
                // component to placate it
                for (let individualStyleName in expansion) {
                    domStyle[individualStyleName] = '';
                }
            } else {
                domStyle[name] = '';
            }
        }
    }
    for (name in style) {
        cur = dangerousStyleValue(name, style[name]);
        if (name === 'float' || name === 'cssFloat') {
            name = styleFloatAccessor;
        }
        if (name === 'delayed') {
            for (name in style.delayed) {
                cur = style.delayed[name];
                if (!oldHasDel || cur !== oldStyle.delayed[name]) {
                    setNextFrame(domStyle, name, cur);
                }
            }
        } else if (cur !== oldStyle[name]) {
            domStyle[name] = cur;
        }
    }
};


function dangerousStyleValue(name, value) {
    var isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
        return '';
    }

    var isNonNumeric = isNaN(value);
    if (isNonNumeric || value === 0 || isUnitlessNumber[name]) {
        return '' + value; // cast to string
    }

    if (typeof value === 'string') {
        value = value.trim();
    }
    return value + 'px';
}

var processDOMAttr = function(lastValue, nextValue, prop, isSVG, dom, vNode) {
    if (lastValue === nextValue) return;
    if (skipProps[prop]) {
        return;
    }
    if (booleanProps[prop]) {
        dom[prop] = nextValue ? true : false;
    } else if (strictProps[prop]) {
        const value = isNullOrUndef(nextValue) ? '' : nextValue;

        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else {
        if (isNullOrUndef(nextValue)) {
            dom.removeAttribute(prop);
        } else if (prop === 'htmlFor') {
            dom.setAttribute('for', nextValue);
        } else if (prop === 'className') {
            if (isSVG) {
                dom.setAttribute('class', nextValue);
            } else {
                dom.className = nextValue;
            }
        } else if (prop === 'dangerouslySetInnerHTML') {
            const lastHtml = lastValue && lastValue.__html;
            const nextHtml = nextValue && nextValue.__html;

            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            let dehyphenProp;
            if (dehyphenProps[prop]) {
                dehyphenProp = dehyphenProps[prop];
            } else if (isSVG && prop.match(probablyKebabProps)) {
                dehyphenProp = prop.replace(/([a-z])([A-Z]|1)/g, kebabize);
                dehyphenProps[prop] = dehyphenProp;
            } else {
                dehyphenProp = prop;
            }
            const ns = namespaces[prop];

            if (ns) {
                dom.setAttributeNS(ns, dehyphenProp, nextValue);
            } else {
                dom.setAttribute(dehyphenProp, nextValue);
            }
        }
    }
};

const propertyHooks = assign({
    style: processDOMStyle,
    __default__: processDOMAttr
}, processDOMPropertyHooks);

function createDOMProperty(props, isSVG, vNode) {
    updateDOMProperty(null, props, isSVG, vNode);
}

function updateDOMProperty(lastProps, nextProps, isSVG, vNode) {
    if (lastProps === nextProps) {
        return;
    }

    const dom = vNode.dom;

    lastProps = lastProps || emptyObject;
    nextProps = nextProps || emptyObject;

    if (nextProps !== emptyObject) {
        for (let prop in nextProps) {
            // do not add a hasOwnProperty check here, it affects performance
            //if (!nextProps.hasOwnProperty(prop)) continue;
            const nextValue = isNullOrUndef(nextProps[prop]) ? null : nextProps[prop];
            const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
            const hook = propertyHooks[prop] ? prop : '__default__';
            propertyHooks[hook](lastValue, nextValue, prop, isSVG, dom, vNode);
        }
    }
    if (lastProps !== emptyObject) {
        for (let prop in lastProps) {
            if (isNullOrUndef(nextProps[prop])) { //lastProps.hasOwnProperty(prop) && 
                const lastValue = isNullOrUndef(lastProps[prop]) ? null : lastProps[prop];
                const hook = propertyHooks[prop] ? prop : '__default__';
                propertyHooks[hook](lastValue, null, prop, isSVG, dom, vNode);
            }
        }
    }
}

function mount(vNode, parentDom, callback, context, isSVG) {
    const isUndefCallbacks = isNullOrUndef(callback);
    let r;
    callback = callback || new CallbackQueue();

    if (isElementVNode(vNode)) {
        r = mountElement(vNode, parentDom, callback, context, isSVG);
    } else if (isTextVNode(vNode)) {
        r = mountText(vNode, parentDom);
    } else if (isComponentVNode(vNode)) {
        r = mountComponent(vNode, parentDom, callback, context, isSVG);
    } else if (isVoidVNode(vNode)) {
        r = mountVoid(vNode, parentDom);
    } else {
        throwError('mount() expects a valid VNode, instead it received an object with the type "' + typeof vNode + '".');
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }
    return r;
}

function mountText(vNode, parentDom) {
    const dom = document.createTextNode(vNode.children);

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

function mountVoid(vNode, parentDom) {
    const dom = document.createComment('emptyNode');

    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}

function mountElement(vNode, parentDom, callback, context, isSVG) {
    const tag = vNode.type;

    if (!isSVG) {
        isSVG = vNode.isSVG;
    }

    const dom = documentCreateElement(tag, isSVG);
    const children = vNode.children;
    const props = vNode.props;
    const events = vNode.events;
    const hooks = vNode.hooks || {};

    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }

    vNode.dom = dom;

    if (!isNullOrUndef(hooks.beforeCreate)) {
        hooks.beforeCreate(vNode);
    }

    processElement(dom, vNode);

    createDOMProperty(props, isSVG, vNode);
    createDOMEvents(vNode);

    if (!isNull(children)) {
        if (isArray(children)) {
            mountArrayChildren(children, dom, callback, context, isSVG);
        } else if (isVNode(children)) {
            mount(children, dom, callback, context, isSVG);
        }
    }

    if (!isNull(vNode.ref)) {
        callback.enqueue(() => attachRef(vNode));
    }

    //if (!isNull(parentDom)) {
    //    appendChild(parentDom, dom);
    //}

    if (!isNullOrUndef(hooks.create)) {
        callback.enqueue(() => hooks.create(vNode));
    }
    return dom;
}

function mountArrayChildren(children, dom, callback, context, isSVG) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (!isInvalid(child)) {
            mount(child, dom, callback, context, isSVG);
        }
    }
}

function mountComponent(vNode, parentDom, callback, context, isSVG) {
    const type = vNode.type;
    const props = vNode.props;
    const hooks = vNode.hooks || {};
    const isClass = isStatefulComponent(type);
    let dom, children;

    if (isClass) {
        const inst = createNeactComponent(vNode, context, isSVG);
        vNode._instance = inst;

        inst._pendingSetState = true;

        if (inst.componentWillMount) {
            inst.componentWillMount();
            if (inst._pendingStateQueue) {
                inst.state = inst._processPendingState(inst.props, inst.context);
            }
        }

        inst._ignoreSetState = true;
        NeactCurrentOwner.current = inst;
        vNode.children = inst.render();
        NeactCurrentOwner.current = null;
        inst._ignoreSetState = false;
        normalizeComponentChildren(vNode);
        inst._vNode = vNode;
        inst._renderedVNode = vNode.children;
        inst._pendingSetState = false;

        vNode.dom = dom = mount(vNode.children, parentDom, callback, inst._childContext, isSVG);

        inst._callbacks = new CallbackQueue();

        if (!isNull(vNode.ref)) {
            callback.enqueue(() => attachRef(vNode));
        }

        if (inst.componentDidMount) {
            callback.enqueue(() => inst.componentDidMount());
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(() => hooks.create(vNode));
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(() => inst._processPendingCallbacks());
        }

    } else {
        //Function Component
        if (!isNullOrUndef(props.onComponentWillMount)) {
            props.onComponentWillMount(vNode);
        }

        vNode.children = type(props, context);
        normalizeComponentChildren(vNode);
        vNode.dom = dom = mount(vNode.children, parentDom, callback, context, isSVG);

        //You may not use the ref attribute on functional components because they don't have instances
        //attachRef(vNode);

        if (!isNullOrUndef(props.onComponentDidMount)) {
            callback.enqueue(() => props.onComponentDidMount(vNode));
        }

        if (!isNullOrUndef(hooks.create)) {
            callback.enqueue(() => hooks.create(vNode));
        }
    }

    return dom;
}

function normalizeComponentChildren(vNode) {
    let children = vNode.children;

    if (isArray(children)) {
        throwError('a valid Neact VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
    } else if (isInvalid(children)) {
        vNode.children = createVoidVNode();
    } else if (isStringOrNumber(children)) {
        vNode.children = createTextVNode(children);
    }

    vNode.children.parentVNode = vNode;

    return vNode;
}

function patch(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    var isUndefCallbacks = isNullOrUndef(callback);
    callback = callback || new CallbackQueue();

    if (lastVNode !== nextVNode) {
        if (!isSameVNode(lastVNode, nextVNode)) {
            replaceWithNewNode(
                lastVNode,
                nextVNode,
                parentDom,
                callback,
                context,
                isSVG
            );
        } else if (isElementVNode(lastVNode)) {
            patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if (isComponentVNode(lastVNode)) {
            patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG);
        } else if (isTextVNode(lastVNode)) {
            patchText(lastVNode, nextVNode);
        } else if (isVoidVNode(lastVNode)) {
            patchVoid(lastVNode, nextVNode);
        }
    }

    if (isUndefCallbacks) {
        callback.notifyAll();
    }

    return nextVNode;
}


function unmountChildren$1(children, dom) {
    if (isVNode(children)) {
        unmount(children, dom);
    } else if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (!isInvalid(child)) {
                unmount(child, dom);
            }
        }
    } else {
        setTextContent(dom, '');
    }
}

function patchElement(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    const dom = lastVNode.dom;
    const hooks = nextVNode.hooks || {};
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const lastChildren = lastVNode.children;
    const nextChildren = nextVNode.children;
    const lastEvents = lastVNode.events;
    const nextEvents = nextVNode.events;

    nextVNode.dom = dom;

    if (hooks.beforeUpdate) {
        hooks.beforeUpdate(lastVNode, nextVNode);
    }

    let refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
    if (refsChanged) {
        detachRef(lastVNode);
    }

    processElement(dom, nextVNode);

    updateDOMProperty(lastVNode.props, nextVNode.props, isSVG, nextVNode);
    updateDOMEvents(lastVNode, nextVNode);

    if (lastChildren !== nextChildren) {
        patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG);
    }

    if (!isNull(nextVNode.ref)) {
        callback.enqueue(() => attachRef(nextVNode));
    }

    if (hooks.update) {
        callback.enqueue(() => hooks.update(nextVNode));
    }

}

function patchChildren(lastChildren, nextChildren, dom, callback, context, isSVG) {
    if (isInvalid(nextChildren)) {
        unmountChildren$1(lastChildren, dom, callback);
    } else if (isInvalid(lastChildren)) {
        if (isArray(nextChildren)) {
            mountArrayChildren(nextChildren, dom, callback, context, isSVG);
        } else {
            mount(nextChildren, dom, callback, context, isSVG);
        }
    } else if (!isArray(lastChildren) && !isArray(nextChildren)) {
        patch(lastChildren, nextChildren, dom, callback, context, isSVG);
    } else {
        updateChildren(toArray(lastChildren), toArray(nextChildren), dom, callback, context, isSVG);
    }
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map$$1 = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (!isNullOrUndef(key)) {
            if (isDefined(map$$1[key])) {
                throwError('key must be unique.');
            }
            map$$1[key] = i;
        }
    }
    return map$$1;
}

function updateChildren(oldCh, newCh, parentElm, callback, context, isSVG) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var newChilds = Array(newCh.length);

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndefined(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndefined(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (isSameVNode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (isSameVNode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVNode(oldStartVnode, newEndVnode)) { // Vnode moved right
            insertBefore(parentElm, oldStartVnode.dom, nextSibling(oldEndVnode.dom));
            patch(oldStartVnode, newEndVnode, parentElm, callback, context, isSVG);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVNode(oldEndVnode, newStartVnode)) { // Vnode moved left
            insertBefore(parentElm, oldEndVnode.dom, oldStartVnode.dom);
            patch(oldEndVnode, newStartVnode, parentElm, callback, context, isSVG);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (isUndefined(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (isUndefined(idxInOld) || isUndefined(oldCh[idxInOld])) { // New element
                var dom = mount(newCh[newStartIdx], null, callback, context, isSVG);
                insertBefore(parentElm, dom, oldStartVnode.dom);
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                insertBefore(parentElm, elmToMove.dom, oldStartVnode.dom);
                patch(elmToMove, newStartVnode, parentElm, callback, context, isSVG);
                oldCh[idxInOld] = undefined;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) { // New element
        before = isUndefined(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].dom;
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            var dom = mount(newCh[newStartIdx], null, callback, context, isSVG);
            insertBefore(parentElm, dom, before);
        }
    } else if (newStartIdx > newEndIdx) { // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {

            if (isDefined(oldCh[oldStartIdx])) {
                unmount(oldCh[oldStartIdx], parentElm);
            }
        }
    }
}

function patchText(lastVNode, nextVNode) {
    const nextText = nextVNode.children;
    const dom = lastVNode.dom;

    nextVNode.dom = dom;

    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}

function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}

function patchComponent(lastVNode, nextVNode, parentDom, callback, context, isSVG) {
    const nextType = nextVNode.type;
    const nextProps = nextVNode.props;
    const isClass = isStatefulComponent(nextType);
    const hooks = nextVNode.hooks || {};

    if (isClass) {
        const inst = lastVNode._instance;
        const lastChildren = lastVNode.children;
        const lastProps = inst.props;
        const lastState = inst.state;
        const lastContext = inst.context;
        let nextChildren, shouldUpdate = false,
            childContext = inst.getChildContext();

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = lastChildren;
        nextVNode._instance = inst;
        inst._isSVG = isSVG;

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, childContext);
        } else {
            childContext = context;
        }

        nextChildren = inst._updateComponent(lastProps, nextProps, context);

        if (nextChildren !== emptyObject) {
            nextVNode.children = nextChildren;
            normalizeComponentChildren(nextVNode);
            nextChildren = nextVNode.children;
            shouldUpdate = true;
        }

        inst._childContext = childContext;
        inst._vNode = nextVNode;
        inst._renderedVNode = nextChildren;

        if (shouldUpdate) {

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            let refsChanged = shouldUpdateRefs(lastVNode, nextVNode);
            if (refsChanged) {
                detachRef(lastVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, childContext, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!isNull(nextVNode.ref)) {
                callback.enqueue(() => attachRef(nextVNode));
            }

            if (inst.componentDidUpdate) {
                callback.enqueue(() => inst.componentDidUpdate(lastProps, lastState, lastContext, nextVNode.dom));
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(() => hooks.update(nextVNode));
            }
        }

        if (inst._pendingCallbacks) {
            callback.enqueue(() => inst._processPendingCallbacks());
        }
    } else {
        let shouldUpdate = true;
        const lastProps = lastVNode.props;
        const lastChildren = lastVNode.children;
        let nextChildren = lastChildren;

        nextVNode.dom = lastVNode.dom;
        nextVNode.children = nextChildren;

        if (!isNullOrUndef(nextProps.onComponentShouldUpdate)) {
            shouldUpdate = nextProps.onComponentShouldUpdate(lastProps, nextProps, context);
        }

        if (shouldUpdate !== false) {
            if (!isNullOrUndef(nextProps.onComponentWillUpdate)) {
                nextProps.onComponentWillUpdate(lastProps, nextProps, vNode);
            }
            nextVNode.children = nextType(nextProps, context);

            normalizeComponentChildren(nextVNode);

            nextChildren = nextVNode.children;

            if (hooks.beforeUpdate) {
                hooks.beforeUpdate(lastVNode, nextVNode);
            }

            patch(lastChildren, nextChildren, parentDom, callback, context, isSVG);
            nextVNode.dom = nextChildren.dom;

            if (!isNullOrUndef(nextProps.onComponentDidUpdate)) {
                callback.enqueue(() => nextProps.onComponentDidUpdate(nextVNode));
            }

            if (!isNullOrUndef(hooks.update)) {
                callback.enqueue(() => hooks.update(nextVNode));
            }
        }
    }
}

function _patch(lastVNode, nextVNode) {
    if (!isInvalid(lastVNode)) {
        if (isDOM(lastVNode)) {
            render(nextVNode, vNode);
        } else if (isVNode(lastVNode) && isVNode(nextVNode)) {
            if (lastVNode.dom) {
                patch(lastVNode, nextVNode);
                if (lastVNode.parentVNode) {
                    assign(lastVNode, nextVNode);
                }
            } else {
                throwError('patch error vNode');
            }
        }

        return nextVNode;
    }
}

function render(vNode, parentDom) {
    if (document.body === parentDom) {
        warning('you cannot render() to the "document.body". Use an empty element as a container instead.');
    }

    const lastVnode = parentDom.__NeactRootNode;

    if (!lastVnode) {
        if (!isInvalid(vNode) && isVNode(vNode)) {
            mount(vNode, parentDom);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    } else {
        if (isInvalid(vNode)) {
            unmount(lastVnode, parentDom);
            parentDom.__NeactRootNode = null;
            delete parentDom.__NeactRootNode;
        } else if (isVNode(vNode)) {
            patch(lastVnode, vNode);
            parentDom.__NeactRootNode = vNode;
            return vNode._instance || vNode.dom;
        } else {
            throwError('isInvalid VNode');
        }
    }
}

function unmountComponentAtNode(dom) {
    if (dom.__NeactRootNode) {
        unmount(dom.__NeactRootNode, dom);
        delete dom.__NeactInstance;
    }
}

function findDOMNode(vNode) {
    if (!isInvalid(isVNode)) {
        if (isVNode(vNode)) {
            return vNode.dom;
        } else if (vNode._vNode) {
            return vNode._vNode.dom;
        }
    }
    return null
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var nativeKeys = Object.keys;

function keys(obj) {
    if (nativeKeys) return nativeKeys(obj);

    var keys = [];

    for (var key in obj) {
        keys.push(key);
    }

    return keys;
}

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

    var keysA = keys(objA);
    var keysB = keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty$1.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

function updateParentComponentVNodes(vNode, dom) {
    const parentVNode = vNode.parentVNode;

    if (parentVNode && !isString(parentVNode.type)) {
        parentVNode.dom = dom;
        updateParentComponentVNodes(parentVNode, dom);
    }
}

function enqueueSetState(component, newState, callback, sync = false) {
    if (!isNullOrUndef(newState)) {
        let queue = component._pendingStateQueue || (component._pendingStateQueue = []);
        queue.push(newState);
    }

    if (callback) {
        let queue = component._pendingCallbacks || (component._pendingCallbacks = []);
        queue.push(callback);
    }

    if (!component._pendingSetState || sync) {
        applyState(component, false, callback);
    }
}

function applyState(inst, callback) {
    const vNode = inst._vNode;
    const parentDom = vNode.dom.parentNode;
    const hooks = vNode.hooks || {};
    const state = inst.state;
    const lastChildren = vNode.children;
    const props = inst.props;
    const context = inst.context;
    let childContext = inst.getChildContext();
    let nextChildren, shouldUpdate = false;

    nextChildren = inst._updateComponent(props, props, context);

    if (nextChildren !== emptyObject) {
        vNode.children = nextChildren;
        normalizeComponentChildren(vNode);
        nextChildren = vNode.children;
        shouldUpdate = true;
    }

    if (shouldUpdate) {

        if (hooks.beforeUpdate) {
            hooks.beforeUpdate(vNode, vNode);
        }

        if (!isNullOrUndef(childContext)) {
            childContext = assign({}, context, inst._childContext, childContext);
        } else {
            childContext = assign({}, context, inst._childContext);
        }

        let callbacks = inst._callbacks;

        patch(lastChildren, nextChildren, parentDom, callbacks, childContext, inst._isSVG);

        const dom = vNode.dom = nextChildren.dom;

        updateParentComponentVNodes(vNode, dom);

        callbacks.notifyAll();

        if (inst.componentDidUpdate) {
            inst.componentDidUpdate(props, state);
        }

        if (!isNullOrUndef(hooks.update)) {
            hooks.update(vNode);
        }
    }

    if (inst._pendingCallbacks) {
        inst._processPendingCallbacks();
    }

    if (isFunction(callback)) {
        callback();
    }
}

function NeactComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

assign(NeactComponent.prototype, {
    _vNode: null,
    _unmounted: true,
    _callbacks: null,
    _isSVG: false,
    _childContext: null,
    _pendingStateQueue: null,
    _pendingCallbacks: null,
    _pendingReplaceState: false,
    _pendingForceUpdate: false,
    _pendingSetState: false,
    _disabledSetState: false,
    _ignoreSetState: false,
    _renderedVNode: null,

    render() {},

    forceUpdate(callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingForceUpdate = true;

        enqueueSetState(this, null, callback);
    },

    setState(newState, callback) {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },

    replaceState(newState, callback) {
        if (this._unmounted) {
            return;
        }
        this._pendingReplaceState = true;
        this.setState(newState, callback);
    },

    setStateSync() {
        if (this._unmounted) {
            return;
        }
        if (!this._disabledSetState) {
            if (!this._ignoreSetState) {
                enqueueSetState(this, newState, callback, true);
            } else {
                warning('ignore update state via setState(...) in shouldComponentUpdate() or render().');
            }
        } else {
            throwError('cannot update state via setState(...) in componentWillUpdate().');
        }
    },

    getChildContext() {},

    _updateComponent(prevProps, nextProps, context) {
        const inst = this;
        if (this._unmounted === true) {
            throwError();
        }

        let willReceive = false;
        let children = emptyObject;
        let shouldUpdate = true;

        if (prevProps !== nextProps) {
            willReceive = true;
        }

        if (willReceive && inst.componentWillReceiveProps) {
            inst._pendingSetState = true;
            inst.componentWillReceiveProps(nextProps, context);
            inst._pendingSetState = false;
        }

        let prevState = inst.state;
        let nextState = inst._processPendingState(nextProps, context);

        inst._ignoreSetState = true;

        if (!inst._pendingForceUpdate) {
            if (inst.shouldComponentUpdate) {
                shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, context);
            } else {
                if (inst._isPureNeactComponent) {
                    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
                }
            }
        }

        if (shouldUpdate !== false) {
            inst._pendingForceUpdate = false;

            if (inst.componentWillUpdate) {
                inst._disabledSetState = true;
                inst.componentWillUpdate(nextProps, nextState, context);
                inst._disabledSetState = false;
            }
            inst.props = nextProps;
            inst.state = nextState;
            inst.context = context;
            NeactCurrentOwner.current = inst;
            children = inst.render();
            NeactCurrentOwner.current = null;
        }

        inst._ignoreSetState = false;

        return children;
    },

    _processPendingState(props, context) {
        var inst = this;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
            return inst.state;
        }

        if (replace && queue.length === 1) {
            return queue[0];
        }

        var nextState = assign({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
            var partial = queue[i];
            assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
    },
    _processPendingCallbacks() {
        const callbacks = this._pendingCallbacks;
        this._pendingCallbacks = null;
        if (callbacks) {
            for (let j = 0; j < callbacks.length; j++) {
                let cb = callbacks[j];
                if (typeof cb === 'function') {
                    cb.call(this);
                }
            }
        }
    }
});

function createClass(spec) {
    function Constructor(props, context) {
        this.state = {};
        this.refs = {};
        this.props = props || {};
        this.context = context || {};

        if (this.construct) {
            this.construct(props, context);
            return;
        }

        var initialState = this.getInitialState ? this.getInitialState(this.props, this.context) : null;

        if (!(typeof initialState === 'object' && !isArray(initialState))) {
            new TypeError('getInitialState(): must return an object or null');
        }

        this.state = initialState;
    }

    inherits(Constructor, NeactComponent, spec);

    Constructor.prototype.constructor = Constructor;

    if (spec.getDefaultProps) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    if (!spec.render) {
        throw new TypeError('createClass(...): Class specification must implement a `render` method.');
    }

    return Constructor;
}

function NeactPureComponent(props, context) {
    this.state = {};
    this.refs = {};
    this.props = props || {};
    this.context = context || {};
}

function ComponentDummy() {}
ComponentDummy.prototype = NeactComponent.prototype;
NeactPureComponent.prototype = new ComponentDummy();
NeactPureComponent.prototype.constructor = NeactPureComponent;

NeactPureComponent.prototype._isPureNeactComponent = true;

var utils = {
    map,
    each,
    inherits,
    bind,
    assign,
    toArray,
    flatten,
    filter
};

const Children = {
    map(obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        return map(toArray(obj), cb, ctx);
    },
    forEach(obj, cb, ctx) {
        if (isNullOrUndef(obj)) return;
        each(toArray(obj), cb, ctx);
    },
    count(children) {
        return toArray(children).length;
    },
    only(children) {
        children = Children.toArray(children);
        if (children.length !== 1) { throw new Error('Children.only() expects only one child.'); }
        return children[0];
    },
    toArray
};

export { render, _patch as patch, findDOMNode, unmountComponentAtNode, Children, createElement, createVNode, createTextVNode, cloneElement, isValidElement, processDOMPropertyHooks, createClass, NeactComponent as Component, NeactPureComponent as PureComponent, utils };
