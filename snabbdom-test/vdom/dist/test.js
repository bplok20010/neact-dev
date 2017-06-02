/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./js";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);

	num = 0;

	var TreeStore = [{
	    text: '跟节点',
	    children: [{ text: '文件夹<strong>A</strong>', expand: false, children: [{ text: '文件.txt' }], leaf: false }, { text: '文件夹B', leaf: false, children: [{ text: '文件夹X', leaf: false }] }, { text: '文件夹C', leaf: false }, { text: '文件夹D', leaf: false }].concat(function() {
	        var count = 3000;
	        var d = [];
	        for (var i = 1; i <= count; i++) {
	            d.push({
	                text: '文件夹' + i,
	                leaf: false
	            });
	        }
	        return d;
	    }())
	}];


	var Tree = React.createClass({
	    getInitialState: function() {
	        return {
	            idx: 1
	        }
	    },
	    isLeaf: function isLeaf(node) {
	        return node.leaf === undefined ? true : node.leaf;
	    },
	    addChild: function addChild(pnode) {
	        if (!pnode.children) {
	            pnode.children = [];
	        }

	        pnode.children.push({
	            text: '文件' + this.state.idx++
	        });

	        pnode.expand = true;
	        sTotal = 0;
	        isInit = false;

	        console.time('tree')
	        this.forceUpdate();
	        console.timeEnd('tree')
	        console.log(sTotal);

	    },
	    removeChild: function removeChild(childs, i) {

	        childs.splice(i, 1);

	        this.forceUpdate();
	    },
	    getChildItem: function getChildItem(data) {
	        var _this = this;

	        var child = data.children;
	        if (!child) return [];
	        return React.createElement('ul', {
	            style: { display: data.expand === false ? 'none' : 'block' }
	        }, child.map(function(node, i) {
	            return React.createElement(
	                'li', { key: i },
	                React.createElement(
	                    'div',
	                    null,
	                    node.text,
	                    ' ',
	                    _this.isLeaf(node) ? React.createElement(
	                        'span', {
	                            style: { cursor: 'pointer' },
	                            'onClick': function onClick() {
	                                return _this.removeChild(child, i);
	                            }
	                        },
	                        '-'
	                    ) : React.createElement(
	                        'span', {
	                            style: { cursor: 'pointer' },
	                            'onClick': function onClick() {
	                                return _this.addChild(node);
	                            }
	                        },
	                        '+'
	                    )
	                ),
	                _this.getChildItem(node)
	            );
	        }));
	    },
	    render: function() {
	        return this.getChildItem(this.props.data[0]);
	    }
	});

	var Avatar = React.createClass({
	    componentWillUnmount: function() {
	        console.log('Avatar componentWillUnmount' + this.props.idx);
	    },
	    componentDidMount: function() {
	        console.log('Avatar componentDidMount');
	        this._instanceCompositeComponent.getDOM().style.border = '1px solid red';
	        this._instanceCompositeComponent.getParentDOM().style.border = '1px solid green';

	    },
	    render: function() {
	        return React.createElement(
	            'div', {},
	            React.createElement('img', {
	                width: 40,
	                height: 40,
	                src: x % 2 ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg',
	                alt: 'test'
	            }));
	    }
	});

	var TextNode = React.createClass({
	    componentDidMount: function() {
	        console.log('TextNode componentDidMount');
	    },
	    render: function() {
	        return null; //'[nobo]'
	    }
	});

	var Li = React.createClass({
	    componentWillReceiveProps: function(p) {
	        // console.log('Li componentWillReceiveProps')
	    },
	    componentWillUnmount: function() {
	        // console.log('Li componentWillUnmount' + this.props.idx);
	    },
	    componentDidMount: function() {
	        // console.log('Li componentDidMount' + this.props.idx);
	    },
	    componentWillUpdate: function() {
	        // console.log('Li componentWillUpdate')
	    },
	    componentDidUpdate: function() {
	        //   console.log('Li componentDidUpdate')
	    },
	    render: function() {
	        return React.createElement('li', {
	            className: x % 2 ? 'a' : 'b',
	            onClick: function() {
	                console.log(4);
	            }
	        }, '20160912-', null, this.props.idx, '-', x, React.createElement('input'))
	    }
	});

	var SvgPath = React.createClass({
	    render: function() {
	        return React.createElement('svg', {
	                width: 1200,
	                height: 360,
	                xmlns: "http://www.w3.org/2000/svg"
	            },
	            React.createElement('path', {
	                d: "M50 50\
	                C153 334 151 334 151 334\
	                C151 339 153 344 156 344\
	                C164 344 171 339 171 334\
	                C171 322 164 314 156 314\
	                C142 314 131 322 131 334\
	                C131 350 142 364 156 364\
	                C175 364 191 350 191 334\
	                C191 311 175 294 156 294\
	                C131 294 111 311 111 334\
	                C111 361 131 384 156 384\
	                C186 384 211 361 211 334\
	                C211 300 186 274 156 274 "
	            })
	        );
	    }
	});

	var s = 10;
	var x = 1;
	var t = 1;

	var LoginLog = React.createClass({
	    componentDidMount: function() {
	        console.log('+?');
	        var self = this;
	        // setInterval  setTimeout
	        setTimeout(function() {
	            x++;


	            if (s > 10) {
	                s -= 2;
	            } else {
	                s += 2;
	            }

	            console.time('update')
	            self.forceUpdate();
	            console.timeEnd('update')
	        }, 250);

	        return;

	        setTimeout(function() {
	            s = 0;
	            console.time('update')
	            self.forceUpdate();
	            console.timeEnd('update')

	            setTimeout(function() {
	                s = 8;
	                console.time('update')
	                self.forceUpdate();
	                console.timeEnd('update')

	                setTimeout(function() {
	                    s = 20;
	                    console.time('update')
	                    self.forceUpdate();
	                    console.timeEnd('update');

	                    setInterval(function() {
	                        x++;
	                        s += 5;

	                        console.time('update')
	                        self.forceUpdate();
	                        console.timeEnd('update')
	                    }, 500);

	                    //self.componentDidMount();
	                }, 500);
	            }, 500);
	        }, 500);
	    },
	    shouldComponentUpdate: function() {
	        //console.log('LoginLog shouldComponentUpdate');
	    },
	    render: function() {
	        var self = this;
	        var childs = [];
	        for (var i = 1; i <= s; i++) {
	            childs.push(
	                React.createElement(Li, { key: i, idx: i })
	                //React.createElement('li', { key: i }, '20160912-' + i, React.createElement('input'))
	            );
	        }

	        if (childs.length) {

	            childs.push(React.createElement(Avatar, {
	                key: 'avatar'
	            }));

	            childs.push('a');
	            childs.push(null);
	            childs.push('b')
	        }

	        childs.sort(function() {
	            return 0.5 - Math.random();
	        });

	        if (childs.length < 1) childs = null;

	        if (childs)
	        // childs.length = Math.min(10, childs.length);

	        //s = 10;

	            if (s > 30) {
	                s = 10
	            }

	            // s += 1
	            //console.log(s)

	        t++;

	        if (t > 40) {
	            t = 1;
	        }

	        if (t == 30 && childs) {
	            childs.length = 0;
	        }

	        if (t == 32 && childs) {
	            childs = null;
	        }

	        return t > 20 ?
	            React.createElement('div', { style: { border: '5px solid gray' } }, React.createElement('ul', {}, childs)) :
	            React.createElement('ul', {}, childs, null, null, 'nobo??');
	    }
	});

	var A0 = React.createClass({
	    render: function() {
	        return null;
	    }
	});

	var A1 = React.createClass({
	    render: function() {
	        return React.createElement(A0)
	    }
	});

	var vnode = React.createElement('div',
	    null,
	    React.createElement(Avatar),
	    React.createElement(SvgPath),
	    React.createElement('span', null, 'nobo'),
	    '-',
	    null,
	    0,
	    React.createElement('span', null, 'zhou'),
	    React.createElement('input'),
	    React.createElement('select', {
	            multiple: true
	        },
	        React.createElement('option', null, 1),
	        React.createElement('option', null, 2),
	        React.createElement('option', null, 3)
	    ),
	    React.createElement(LoginLog),
	    React.createElement(TextNode),
	    '--------component return null test--------',
	    '====================Tree=====================',
	    React.createElement(Tree, {
	        data: TreeStore
	    })
	);

	var render = React.render(vnode, document.body);

	var render1 = React.render(React.createElement(A1), document.body);


	window.render = render;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var element = __webpack_require__(2);
	var Class = __webpack_require__(5);
	var Mount = __webpack_require__(8);

	var Nob = {
	    createElement: element.createElement,
	    createTextElement: element.createTextElement,
	    createFactory: element.createFactory,
	    isValidElement: element.isValidElement,
	    createClass: Class.createClass,
	    render: Mount.render
	};

	module.exports = Nob;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var E_TYPE = '_VDOM_';

	var protectedProps = {
	    key: true,
	    ref: true
	};

	var element = function(type, key, props, ref, isSvg) {
	    var element = {
	        $$typeof: E_TYPE,
	        type: type,
	        key: key,
	        ref: ref,
	        isSvg: isSvg,
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
	    var isSvg = false;

	    if (is.def(config)) {
	        if (is.def(config.ref)) {
	            ref = config.ref;
	        }
	        if (is.def(config.key)) {
	            key = '' + config.key;
	        }

	        for (propName in config) {
	            //hasOwnProperty 检测会影响性能
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

	    return element(type, key, props, ref, isSvg);
	};

	var createFactory = function(type) {
	    var factory = util.bind(createElement, null, type);
	    factory.type = type;
	    return factory;
	};

	function createTextElement(text) {
	    return element('#text', null, { text: text }, null, false);
	}

	function createVoidElement() {
	    return element('#comment', null, {}, null, false);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	var objToString = Object.prototype.toString;
	var isArray = Array.isArray || function(s) {
	    return objToString.call(s) === '[object Array]';
	};

	module.exports = {
	    DOM_NODE: 1,
	    CLASS_NODE: 2,
	    TEXT_NODE: 3,
	    EMPTY_NODE: 11,
	    array: isArray,
	    string: function(obj) {
	        return typeof obj === 'string';
	    },
	    number: function(obj) {
	        return typeof obj === 'number';
	    },
	    "function": function(obj) {
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
	        return (inst.key) === vnode.key && inst.type === vnode.type;
	    }

	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * @author nobo (zere.nobo@gmail.com)
	 * 
	 */

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);
	var patch = __webpack_require__(6);

	function ClassComponent(props, context) {}

	util.merge(ClassComponent.prototype, {
	    setState: function(newState, callback) {
	        var inst = this._instanceCompositeComponent;

	        if (inst._unmounted) {
	            return;
	        }

	        if (is["function"](newState)) {
	            newState = newState(this.state);
	        }
	        for (var key in newState) {
	            this.state[key] = newState[key];
	        }

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
	    }
	});

	function Component(props, context) {
	    this.props = props || {};
	    this.context = context || {};
	}

	util.inherits(Component, ClassComponent);


	module.exports = {

	    Component: Component,

	    createClass: function(spec) {
	        function Constructor(props, context) {
	            this.props = props || {};
	            this.state = null;
	            this.context = context;

	            var initialState = this.getInitialState ? this.getInitialState() : null;

	            if (!(typeof initialState === 'object' && !is.array(initialState))) {
	                new TypeError('getInitialState(): must return an object or null');
	            }

	            this.state = initialState;
	        }

	        util.inherits(Constructor, ClassComponent, spec);

	        Constructor.prototype.constructor = Constructor;

	        if (Constructor.getDefaultProps) {
	            Constructor.defaultProps = Constructor.getDefaultProps();
	        }

	        if (!Constructor.prototype.render) {
	            new TypeError('createClass(...): Class specification must implement a `render` method.');
	        }

	        return Constructor;
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);
	var api = __webpack_require__(7);
	var mount = __webpack_require__(8).mount;
	var unmount = __webpack_require__(16).unmount;
	var createTextElement = __webpack_require__(2).createTextElement;
	var createVoidElement = __webpack_require__(2).createVoidElement;

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
	        if (1) {

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

	        }
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

	    var willReceive = false;

	    if (prevElement !== nextElement) {
	        willReceive = true;
	    }

	    if (willReceive) {
	        prevComponent.componentWillReceiveProps(nextProps);
	    }

	    var nextState = prevComponent._instance.state;
	    var shouldUpdate = true;

	    shouldUpdate = prevComponent.shouldComponentUpdate(nextProps, nextState);

	    if (shouldUpdate === false) return;

	    prevComponent.componentWillUpdate(nextProps, nextState);

	    var lastChildren = prevComponent.children;

	    prevComponent.props = nextElement.props;
	    prevComponent._currentElement = nextElement;

	    var nextChildren = prevComponent.render();

	    patchVnode(lastChildren, nextChildren);

	    prevComponent.componentDidUpdate(nextProps, nextState);

	}

	function patchDOMComponent(prevComponent, nextElement) {
	    var dom = prevComponent.getDOM();
	    var lastChildren = prevComponent.children;
	    var prevProps = prevComponent.props;
	    var nextProps = nextElement.props;
	    var parentDOM = dom;

	    if (prevProps !== nextProps) {
	        //这一步有性能问题，待研究
	        prevComponent.patchProps(prevProps, nextProps, dom);
	    }

	    prevComponent.props = nextElement.props;
	    prevComponent._currentElement = nextElement;

	    var nextChildren = prevComponent.render();

	    //use invalid?
	    if (is.def(lastChildren) && is.def(nextChildren)) {
	        if (lastChildren !== nextChildren) {
	            updateChildren(prevComponent, util.toArray(lastChildren), util.toArray(nextChildren));
	        }
	    } else if (is.def(nextChildren)) {
	        nextChildren = util.toArray(nextChildren);
	        var news = [];
	        for (i = 0; i < nextChildren.length; i++) {
	            var child = nextChildren[i];
	            if (is.invalid(child)) continue;
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

	function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    if (is.invalid(vnode)) {
	        return;
	    }
	    if (!is.component(oldVnode)) {
	        return;
	    }

	    var i, hook;
	    var parentElm = oldVnode.getParentDOM(),
	        elm = oldVnode.getDOM();

	    if (!is.sameVnode(oldVnode, vnode)) {
	        var parentVnode = oldVnode.parentNode;
	        var inst = mount(vnode, parentVnode, parentElm, elm);
	        unmount(oldVnode);
	        if (parentVnode) { // && is.compositeComponent(parentVnode)
	            parentVnode.children = inst;
	        }
	        return;
	    }

	    if (is.compositeComponent(oldVnode)) {
	        patchComponent(oldVnode, vnode);
	    } else if (is.domComponent(oldVnode)) {
	        patchDOMComponent(oldVnode, vnode);
	    } else if (is.domTextComponent(oldVnode)) {
	        patchDOMTextComponent(oldVnode, vnode);
	    }
	}


	module.exports = {
	    patchVnode: patchVnode,
	    updateChildren: updateChildren
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

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
	    node.textContent = text;
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
	    setTextContent: setTextContent
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);
	var DOMApi = __webpack_require__(7);
	var instantiateComponent = __webpack_require__(9);

	function unmountComponentAtNode(dom) {}

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

	    return inst.getDOM();
	}

	function premount(vnode, parentInst, insertedVnodeQueue) {
	    //if (is.invalid(vnode)) {
	    //    throw new TypeError('vnode invalid');
	    //}

	    var inst = instantiateComponent(vnode, parentInst);

	    mountInstance(inst, null, insertedVnodeQueue);

	    return inst;
	}

	function mount(vnode, parentInst, parentDOM, before) {
	    var i, dom;
	    var insertedVnodeQueue = [];
	    var inst = premount(vnode, parentInst, insertedVnodeQueue);

	    dom = inst.getDOM();

	    //防止classComponent 返回null 
	    if (parentDOM && dom) { //? && dom
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
	        return mount(vnode, null, parentDOM, null)._instance;
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);
	var createTextElement = __webpack_require__(2).createTextElement;
	var createVoidElement = __webpack_require__(2).createVoidElement;
	var DOMComponent = __webpack_require__(10);
	var TextDOMComponent = __webpack_require__(13);
	var CompositeComponent = __webpack_require__(14);
	var EmptyComponent = __webpack_require__(15);

	function createComponent(element) {
	    var instance;
	    //if (typeof element === 'object' && element._instance) {
	    //    return element;
	    //}

	    if (is.invalid(element) || is.invalidElement(element)) {
	        instance = new EmptyComponent();
	    } else if (is.textElement(element)) {
	        instance = new TextDOMComponent(element);
	    } else if (is.compositeElement(element)) {
	        instance = new CompositeComponent(element);
	    } else if (typeof element.type === 'string') {
	        instance = new DOMComponent(element);
	    } else {
	        console.log(element, '??????')
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

	    if (is.compositeComponent(inst)) {
	        inst.componentWillMount();
	    }

	    if (is.emptyComponent(inst) || is.domTextComponent(inst)) {
	        return inst;
	    }

	    var isSvg = vnode.isSvg;

	    var childs = inst.render();

	    if (is.compositeComponent(inst)) {
	        inst.children = instantiateComponent(childs, inst);
	    } else {

	        if (1) {

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

	        } else {

	            if (is.array(childs)) {
	                inst.children = util.map(childs, function(node) {
	                    if (is.invalid(node)) return null;
	                    node.isSvg = isSvg;
	                    return instantiateComponent(node, inst);
	                });
	            } else if (!is.invalid(childs)) {
	                childs.isSvg = isSvg;
	                inst.children = instantiateComponent(childs, inst);
	            }

	        }

	    }

	    return inst;
	}

	module.exports = instantiateComponent;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * author nobo<zere.nobo@gmail.com>
	 * 
	 * */
	var util = __webpack_require__(4);
	var is = __webpack_require__(3);
	var vnode = __webpack_require__(2);
	var BaseCompositeComponent = __webpack_require__(11);
	var eProps = __webpack_require__(12);

	var svgNS = 'http://www.w3.org/2000/svg';

	var EMPTY_OBJ = {};

	function DOMComponent(element) {
	    BaseCompositeComponent.call(this, element);
	}
	util.inherits(DOMComponent, BaseCompositeComponent, {
	    _isDOMComponent: true,
	    _getInstance: function() {
	        var el;
	        if (this._currentElement.isSvg) {
	            el = document.createElementNS(svgNS, this.type);
	        } else {
	            el = document.createElement(this.type);
	        }
	        this.patchProps(null, this.props, el);
	        return el;
	    },
	    render: function() {
	        var childs = this._currentElement.props.children;

	        if (1) {
	            if (is.array(childs)) {
	                childs = util.flatten(childs);
	            }
	            return childs;
	        }

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
	                sTotal++;
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
	            var value = isNullOrUndef(nextValue) ? '' : nextValue;
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
	        console.log(prop);
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
	    patchEvents: function() {},
	    patchEvent: function(name, lastValue, nextValue, dom) {
	        dom[name.toLowerCase()] = nextValue;
	    }

	});

	module.exports = DOMComponent;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4);
	var is = __webpack_require__(3);

	function Component(element) {
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

	util.merge(Component.prototype, {
	    _isComponent: true,
	    _unmounted: true,
	    _getInstance: function() {
	        throw new TypeError('abstract method');
	    },
	    render: function() {
	        return null;
	    },
	    getDOM: function() {
	        if (!is.compositeComponent(this)) return this.dom;

	        var vnode = this,
	            dom = vnode.dom;

	        while (!dom && (vnode = (is.array(vnode.children) ? vnode.children[0] : vnode.children))) {
	            dom = vnode.dom;
	        }

	        return dom;
	    },
	    getParentDOM: function() {
	        var dom = this.getDOM();
	        return dom ? dom.parentNode : null;
	    }
	});


	module.exports = Component;

/***/ },
/* 12 */
/***/ function(module, exports) {

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
	constructDefaults('children,ref,key,selected,checked,value,multiple', skipProps, true);
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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * author nobo<zere.nobo@gmail.com>
	 * 
	 * */
	var util = __webpack_require__(4);
	var Component = __webpack_require__(11);

	function TextDOMComponent(element) {
	    this.text = element.props.text;
	    Component.call(this, element);
	}
	util.inherits(TextDOMComponent, Component, {
	    _isDOMTextComponent: true,
	    _getInstance: function() {
	        return document.createTextNode(this._currentElement.props.text);
	    }
	});

	module.exports = TextDOMComponent;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * author nobo<zere.nobo@gmail.com>
	 * 
	 * */
	var util = __webpack_require__(4);
	var is = __webpack_require__(3);
	var vnode = __webpack_require__(2);
	var Component = __webpack_require__(11);


	function CompositeComponent(element) {
	    Component.call(this, element);
	    //this.elm = null;
	    this.dom = null;
	    this._instance._instanceCompositeComponent = this;
	}
	util.inherits(CompositeComponent, Component, {
	    _isCompositeComponent: true,
	    _getInstance: function() {
	        var type = this.type;
	        var props = this._currentElement.props;
	        return new type(props);
	    },
	    render: function() {
	        var childs = this._instance.render();
	        if (is.array(childs)) {
	            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
	        }
	        if (is.primitive(childs)) {
	            childs = vnode.createTextElement(childs);
	        } else if (is.invalid(childs)) {
	            childs = vnode.createVoidElement();
	        }

	        return childs;
	    },
	    componentWillMount: function() {
	        var instance = this._instance;
	        if (instance.componentWillMount) {
	            instance.componentWillMount();
	        }
	    },
	    componentDidMount: function() {
	        var instance = this._instance;
	        if (instance.componentDidMount) {
	            instance.componentDidMount();
	        }
	    },
	    componentWillReceiveProps: function(nextProps) {
	        var instance = this._instance;
	        if (instance.componentWillReceiveProps) {
	            instance.componentWillReceiveProps(nextProps);
	        }
	    },
	    shouldComponentUpdate: function(nextProps, nextState) {
	        var instance = this._instance;
	        if (instance.shouldComponentUpdate) {
	            return instance.shouldComponentUpdate(nextProps, nextState);
	        }
	    },
	    componentWillUpdate: function(nextProps, nextState) {
	        var instance = this._instance;
	        if (instance.componentWillUpdate) {
	            instance.componentWillUpdate(nextProps, nextState);
	        }
	    },
	    componentDidUpdate: function(nextProps, nextState) {
	        var instance = this._instance;
	        if (instance.componentDidUpdate) {
	            instance.componentDidUpdate(nextProps, nextState);
	        }
	    }
	});

	module.exports = CompositeComponent;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * author nobo<zere.nobo@gmail.com>
	 * 
	 * */
	var util = __webpack_require__(4);
	var is = __webpack_require__(3);
	var Component = __webpack_require__(11);

	function EmptyComponent(element) {
	    this.props = {};
	    this._currentElement = null;
	    var instance = this._getInstance();
	    this.elm = instance;
	    this.dom = instance;
	}
	util.inherits(EmptyComponent, Component, {
	    _isEmptyComponent: true,
	    _getInstance: function() {
	        return document.createComment('empty-node');
	    }
	});

	module.exports = EmptyComponent;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);
	var util = __webpack_require__(4);
	var DOMApi = __webpack_require__(7);

	function unmount(inst, parentDom, isRecycling) {
	    if (inst._isCompositeComponent) {
	        unmountComponent(inst, parentDom, isRecycling);
	    } else if (inst._isDOMComponent) {
	        unmountElement(inst, parentDom, isRecycling);
	    } else if (inst._isDOMTextComponent || inst._isEmptyComponent) {
	        unmountText(inst, parentDom);
	    }
	}

	function unmountComponent(inst, parentDom, isRecycling) {
	    var children = inst.children;
	    var instance = inst._instance;
	    var dom = inst.getDOM();

	    if (!isRecycling) {
	        if (!inst._unmounted) {
	            instance.componentWillUnmount && instance.componentWillUnmount();
	            instance._unmounted = inst._unmounted = true;

	            if (children) {
	                unmount(children, null, isRecycling);
	            }
	        }
	    }
	    if (parentDom) {
	        DOMApi.removeChild(parentDom, dom);
	    }
	}

	function unmountElement(inst, parentDom, isRecycling) {
	    var dom = inst.dom;
	    var props = inst.props;

	    if (!isRecycling) {
	        unmountChildren(inst.children, isRecycling)
	    }

	    for (var name in props) {
	        // do not add a hasOwnProperty check here, it affects performance
	        if (is.attrEvent(name)) {
	            inst.patchEvent(name, props[name], null, dom);
	        }
	    }

	    if (parentDom) {
	        DOMApi.removeChild(parentDom, dom);
	    }
	}

	function unmountText(inst, parentDom) {
	    if (parentDom) {
	        DOMApi.removeChild(parentDom, inst.dom);
	    }
	}

	function unmountChildren(children, isRecycling) {
	    if (is.array(children)) {
	        for (var i = 0; i < children.length; i++) {
	            var child = children[i];

	            if (!is.invalid(child) && is.object(child)) {
	                unmount(child, null, isRecycling);
	            }
	        }
	    } else if (is.object(children)) {
	        unmount(children, null, isRecycling);
	    }
	}

	module.exports = {
	    unmountElement: unmountElement,
	    unmountComponent: unmountComponent,
	    unmountText: unmountText,
	    unmount: function(inst) {
	        unmount(inst, inst.getParentDOM());
	    }
	};

/***/ }
/******/ ]);