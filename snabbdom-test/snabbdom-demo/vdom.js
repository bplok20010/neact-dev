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
	var ReactElement = __webpack_require__(9);
	React.createElement = ReactElement.createElement;
	var is = __webpack_require__(2);
	var instantiateReactComponent = __webpack_require__(8);
	var ReactDOM = __webpack_require__(11);



	var Avatar = React.createClass({
	    componentDidMount: function() {
	        console.log('Avatar componentDidMount');
	        console.log(this._instance, '?');
	        this._instance.getDOM().style.border = '1px solid red';
	        this._instance.getParentDOM().style.border = '1px solid green';
	        // this._currentElement.elm.style.border = '1px solid red'

	    },
	    render: function() {
	        return React.createElement(
	            'div', {},
	            React.createElement('img', {
	                src: './avatar.png',
	                alt: 'test'
	            }));
	    }
	});

	var s = 6;
	var LoginLog = React.createClass({
	    componentDidMount: function() {
	        var self = this;
	        console.log('LoginLog componentDidMount');
	        setTimeout(function() {
	            self.forceUpdate();
	        }, 2000);
	    },
	    render: function() {
	        var childs = [];
	        for (var i = 1; i <= s; i++) {
	            childs.push(
	                React.createElement('li', { key: i }, '20160912-' + i)
	            );
	        }

	        childs.push(React.createElement(Avatar, {
	            key: 'avatar'
	        }));

	        childs.sort(function() {
	            return 0.5 - Math.random();
	        });

	        return React.createElement('ul', {}, childs);
	    }
	});

	var vnode = React.createElement('div',
	    null,
	    React.createElement(Avatar),
	    React.createElement('span', null, 'nobo'),
	    '-',
	    null,
	    React.createElement('span', null, 'zhou'),
	    React.createElement('input'),
	    React.createElement('select', null, React.createElement('option')),
	    React.createElement(LoginLog)
	);

	//vnode = createVNode(vnode);

	var render = ReactDOM.render(React.createElement(LoginLog), document.body);

	//render.updateRenderChildren();

	console.log(render, 'dd')

	function log(vnode) {
	    console.log(vnode);
	    if (is.array(vnode.$vnode.children)) {
	        vnode.$vnode.children.forEach(function(node) {
	            if (node)
	                log(node);
	        });
	    } else {
	        if (vnode.$vnode.children)
	            log(vnode.$vnode.children)
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(2);
	var ReactComponent = __webpack_require__(3);


	function merge(target, source){
	    for (name in source) {
	      if (source.hasOwnProperty(name)) {
		      target[name] = source[name];
	      }
	    }
	}

	function ReactClassComponent(){}

	merge( ReactClassComponent.prototype, ReactComponent.prototype );

	merge({

	  /**
	   * TODO: This will be deprecated because state should always keep a consistent
	   * type signature and the only use case for this, is to avoid that.
	   */
	  replaceState: function (newState, callback) {
	    this.updater.enqueueReplaceState(this, newState);
	    if (callback) {
	      this.updater.enqueueCallback(this, callback, 'replaceState');
	    }
	  },

	  /**
	   * Checks whether or not this composite component is mounted.
	   * @return {boolean} True if mounted, false otherwise.
	   * @protected
	   * @final
	   */
	  isMounted: function () {
	    
	  }
	});

	/**
	 * 
	 * 
	 */
	var ReactClass = {
	    createClass : function(spec){
	        function Constructor(props, context) {
	            this.props = props;
	            this.state = null;

	            var initialState = this.getInitialState ? this.getInitialState() : null;
	            
	            if(!(typeof initialState === 'object' && !is.array(initialState))) {
	                new TypeError('getInitialState(): must return an object or null');
	            }

	            this.state = initialState;
	        }

	        Constructor.prototype = new ReactClassComponent();
	        Constructor.prototype.constructor = Constructor;

	        merge(Constructor.prototype, spec);

	        if (Constructor.getDefaultProps) {
	          Constructor.defaultProps = Constructor.getDefaultProps();
	        }

	        if(!Constructor.prototype.render) {
	            new TypeError('createClass(...): Class specification must implement a `render` method.');
	        }

	        return Constructor;
	    }
	};

	module.exports = ReactClass;

/***/ },
/* 2 */
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
	    vtextnode: function(vnode) {
	        return this.def(vnode.text);
	    },
	    component: function(d) {
	        return typeof d.type === 'function';
	    },
	    primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
	    undef: function(s) {
	        return s === undefined || s === null;
	    },
	    def: function(s) {
	        return s !== undefined && s !== null;
	    },
	    classComponent: function(obj) {
	        return obj.$isReactComponent
	    },
	    dom: function(obj) {
	        return obj && obj.nodeType === 1 &&
	            typeof(obj.nodeName) == 'string';
	    },
	    textNode: function(obj) {
	        return obj.nodeType === 3;
	    },
	    sameVnode: function(vnode1, vnode2) {
	        return (vnode1.key) === vnode2.key && vnode1.type === vnode2.type;
	    }

	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var updater = __webpack_require__(4)
	    /**
	     * Base class helpers for the updating state of a component.
	     */
	function ReactComponent(props, context) {
	    this.props = props;
	    this.context = context;
	    this.refs = emptyObject;
	    // We initialize the default updater but the real one gets injected by the
	    // renderer.
	    //this.updater = updater || ReactNoopUpdateQueue;
	}

	ReactComponent.prototype.$isReactComponent = true;

	ReactComponent.prototype.setState = function(partialState, callback) {};
	/**
	 * @param {Function} callback 
	 * 触发重绘机制
	 */
	ReactComponent.prototype.forceUpdate = function(callback) {
	    var self = this;
	    //var parentDOM = this._instance.getParentDOM();
	    setTimeout(function() {
	        //自定义组件返回的必定不是数组所以这里用patchVnode
	        updater.patchVnode(self._instance.children, self._instance.render(), []);
	    }, 0);
	}
	module.exports = ReactComponent;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(2);
	var util = __webpack_require__(5);
	var api = __webpack_require__(6);
	var parseVNode = __webpack_require__(7);
	var Render = __webpack_require__(10);
	var vElement = __webpack_require__(9);

	function createKeyToOldIdx(children, beginIdx, endIdx) {
	    var i, map = {},
	        key;
	    for (i = beginIdx; i <= endIdx; ++i) {
	        key = children[i].key;
	        if (is.def(key)) map[key] = i;
	    }
	    return map;
	}

	function updateChildren(parentVnode, oldCh, newCh, insertedVnodeQueue) {

	    if (is.array(newCh)) {
	        newCh = util.map(newCh, function(vnode) {
	            if (is.primitive(vnode)) {
	                var _text = vnode;
	                vnode = vElement.createElement(null);
	                vnode.text = _text;
	            }
	            return vnode
	        });
	    }

	    var oldStartIdx = 0,
	        newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;

	    var parentElm = parentVnode.getParentDOM();

	    console.log(oldCh, newCh);

	    var newChilds = Array(newCh.length);
	    //开始循环
	    //当新旧任意一个检测完后就退出
	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	        if (is.undef(oldStartVnode)) { //对于undefind的子节点字节跳过
	            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	        } else if (is.undef(oldEndVnode)) { //对于undefind的子节点字节跳过
	            oldEndVnode = oldCh[--oldEndIdx];
	        } else if (is.sameVnode(oldStartVnode, newStartVnode)) { //是否相同KEY
	            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	            newChilds[newStartIdx] = oldStartVnode;
	            oldStartVnode = oldCh[++oldStartIdx];
	            newStartVnode = newCh[++newStartIdx];
	        } else if (is.sameVnode(oldEndVnode, newEndVnode)) {
	            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	            newChilds[newEndIdx] = oldEndVnode;
	            oldEndVnode = oldCh[--oldEndIdx];
	            newEndVnode = newCh[--newEndIdx];
	        } else if (is.sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	            //if(!is.vcomponent(oldEndVnode)) 
	            api.insertBefore(parentElm, oldStartVnode.getDOM(), api.nextSibling(oldEndVnode.getDOM()));
	            newChilds[newEndIdx] = oldStartVnode;
	            oldStartVnode = oldCh[++oldStartIdx];
	            newEndVnode = newCh[--newEndIdx];
	        } else if (is.sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	            api.insertBefore(parentElm, oldEndVnode.getDOM(), oldStartVnode.getDOM());
	            newChilds[newStartIdx] = oldEndVnode;
	            oldEndVnode = oldCh[--oldEndIdx];
	            newStartVnode = newCh[++newStartIdx];
	        } else {

	            if (is.undef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	            idxInOld = oldKeyToIdx[newStartVnode.key];
	            if (is.undef(idxInOld) || is.undef(oldCh[idxInOld])) { // New element
	                //api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.getDOM());
	                console.log(newStartVnode, oldStartVnode, 'new...')
	                newStartVnode = newCh[++newStartIdx];
	            } else {
	                elmToMove = oldCh[idxInOld];
	                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	                oldCh[idxInOld] = undefined;
	                api.insertBefore(parentElm, elmToMove.getDOM(), oldStartVnode.getDOM());
	                newChilds[newStartIdx] = elmToMove;
	                newStartVnode = newCh[++newStartIdx];
	            }
	        }
	    }

	    parentVnode.children = newChilds;
	    return;
	    if (oldStartIdx > oldEndIdx) {
	        before = is.undef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	}

	function addVnodes(vnode, parentVnode) {
	    vnode = parseVNode(vnode, parentVnode);

	    createElm(vnode, parentVnode.getDOM(), insertedVnodeQueue);

	    return vnode;
	}

	function removeVnodes(vnode) {
	    var node = null;
	    var pdom = vnode.getParentDOM();
	    api.removeChild(pdom, vnode.getDOM());
	}

	function patchVnode(oldVnode, vnode, insertedVnodeQueue) {

	    var i, hook;

	    if (is.primitive(vnode)) {
	        var _text = vnode;
	        vnode = vElement.createElement(null);
	        vnode.text = _text;
	    }

	    var parentElm = oldVnode.getParentDOM(),
	        elm = oldVnode.getDOM(),
	        oldCh = oldVnode.children,
	        ch = oldVnode.render().props.children;
	    //console.log(oldVnode, vnode);
	    //return;
	    if (oldVnode === vnode) return;

	    if (!is.sameVnode(oldVnode, vnode)) {
	        elm = createElm(parseVNode(vnode, oldVnode.parentNode), null, insertedVnodeQueue);
	        api.insertBefore(parentElm, elm, oldVnode.getDOM());
	        removeVnodes(oldVnode);
	        return;
	    }
	    //优先级 vnode.text > vnode.children
	    if (is.undef(vnode.text)) {
	        if (is.def(oldCh) && is.def(ch)) {
	            oldCh = is.array(oldCh) ? oldCh : [oldCh];
	            ch = is.array(ch) ? ch : [ch];
	            //如果新旧vdom都存在子节点则调用updateChildren进行
	            if (oldCh !== ch) updateChildren(oldVnode, oldCh, util.flatten(ch), insertedVnodeQueue);
	        } else if (is.def(ch)) { //old vdom无children时
	            //清空old vdom的文本内容
	            //if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	            //把new vdom的children直接插入到elm
	            oldVnode.children = addVnodes(ch, oldVnode, insertedVnodeQueue);
	        } else if (is.def(oldCh)) {
	            //new vdom不存在children时
	            //删除vdom.elm下所有节点 并调用相应的hook
	            console.log(oldVnode, vnode, '??');
	            //removeVnodes(oldVnode);
	            //oldVnode.children = null;
	        } else if (is.def(oldVnode.text)) {
	            //old vdom还存在text 也清空
	            api.setTextContent(elm, '');
	        }
	    } else if (oldVnode.text !== vnode.text) {
	        api.setTextContent(oldVnode.getDOM(), vnode.text);
	    }
	    //if (is.def(hook) && is.def(i = hook.postpatch)) {
	    //    i(oldVnode, vnode);
	    //}
	}


	module.exports = {
	    patchVnode: patchVnode,
	    updateChildren: updateChildren
	};

/***/ },
/* 5 */
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

	/**
	 * 构造类继承关系
	 * @param {Function} cls 源类
	 * @param {Function} base 基类
	 */
	function inherits(cls, base) {
	    var clsProto = cls.prototype;

	    function F() {}
	    F.prototype = base.prototype;
	    cls.prototype = new F();

	    for (var prop in clsProto) {
	        cls.prototype[prop] = clsProto[prop];
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

	module.exports = {
	    inherits: inherits,
	    merge: merge,
	    each: each,
	    map: map,
	    flatten: flatten,
	    filter: filter,
	    bind: bind
	};

/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(2);
	var util = __webpack_require__(5);
	var instantiateReactComponent = __webpack_require__(8);

	function createVnode(vnode, parentVnode) {
	    if (is.undef(vnode)) return vnode;

	    var vnode = instantiateReactComponent(vnode);

	    vnode.parentNode = parentVnode;

	    var childs = vnode.getRenderChildren();

	    if (is.array(childs)) {
	        vnode.children = util.map(childs, function(node) {
	            return createVnode(node, vnode);
	        });
	    } else if (is.def(childs)) {
	        vnode.children = createVnode(childs, vnode);
	    }

	    return vnode;
	}

	module.exports = createVnode;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * author nobo<zere.nobo@gmail.com>
	 * 
	 * */
	var util = __webpack_require__(5);
	var is = __webpack_require__(2);
	var React = __webpack_require__(1);
	var ReactElement = __webpack_require__(9);
	React.createElement = ReactElement.createElement;

	var DOM_NODE = 1;
	var CLASS_NODE = 2;
	var TEXT_NODE = 3;
	var EMPTY_NODE = 11;

	function getComponentType(element) {
	    if (is.undef(element)) {
	        instance = new ReactEmptyComponent(element);
	    } else if (is.primitive(element)) {
	        instance = new ReactTextComponent(element);
	    } else if (isInternalComponentType(element.type)) {
	        instance = new ReactClassComponent(element);
	    } else {
	        instance = new ReactDOMComponent(element);
	    }
	}

	function ReactBaseComponent(element) {

	}

	util.merge(ReactBaseComponent.prototype, {
	    render: function() {
	        return null;
	    },
	    getDOM: function() {
	        if (!is.classComponent) return this.elm;

	        var vnode = this,
	            dom = vnode.elm;

	        while (!dom && (vnode = vnode.children)) {
	            dom = vnode.elm;
	        }

	        return dom;
	    },
	    getParentDOM: function() {
	        if (!is.classComponent) return this.elm;
	        var vnode = this,
	            dom = vnode.elm;

	        while (!dom && (vnode = vnode.parentNode)) {
	            dom = vnode.elm;
	        }

	        return dom;
	    },
	    /**
	     * 返回当前组件的子节点
	     */
	    getRenderChildren: function() {
	        //this._renderChildren = this.render();
	        return this.render(); //this._renderChildren;
	    },
	    /**
	     * 返回当前节点下的所有子节点
	     */
	    updateRenderChildren: function() {
	        if (is.undef(this.children)) {
	            return null;
	        }
	        this.getRenderChildren();
	        if (is.array(this.children)) {
	            util.each(this.children, function(node) {
	                node.updateRenderChildren();
	            });
	        } else {
	            this.children.updateRenderChildren();
	        }
	        return null;
	    }
	});

	function ReactEmptyComponent() {

	}
	util.inherits(ReactEmptyComponent, ReactBaseComponent);

	function ReactDOMComponent(element) {
	    var instance = document.createElement(element.type);
	    this._instance = instance;
	    this._currentElement = element;
	    this.elm = instance;
	    this.key = element.key;
	    this.type = element.type;
	}
	util.inherits(ReactDOMComponent, ReactBaseComponent);
	util.merge(ReactDOMComponent.prototype, {
	    render: function() { //flatten
	        var childs = this._currentElement.props.children;
	        if (is.array(childs)) {
	            childs = util.flatten(childs);
	        }
	        return childs;
	    }
	});

	function ReactTextComponent(element) {
	    var instance = document.createTextNode(element);
	    this._instance = instance;
	    this._currentElement = React.createElement(null);
	    //this._currentElement.text = element;
	    this.elm = instance;
	    this.text = element;
	    this.key = this._currentElement.key;
	    this.type = this._currentElement.type;
	}
	util.inherits(ReactTextComponent, ReactBaseComponent);

	function ReactClassComponent(element) {
	    var instance = new element.type(element.props);
	    this._instance = instance;
	    this._currentElement = element;
	    this.elm = null;
	    this.key = element.key;
	    this.type = element.type;
	    instance._instance = this;
	}

	util.inherits(ReactClassComponent, ReactBaseComponent);
	util.merge(ReactClassComponent.prototype, {
	    render: function() {
	        var childs = this._instance.render();
	        if (is.array(childs)) {
	            childs = util.flatten(childs);
	        }
	        return childs;
	    }
	});

	function isInternalComponentType(type) {
	    return typeof type === 'function' && typeof type.prototype !== 'undefined';
	}

	function instantiateReactComponent(element) {
	    var instance;
	    if (typeof element === 'object' && element._instance) {
	        return instance;
	    }
	    if (is.undef(element)) {
	        instance = new ReactEmptyComponent(element);
	    } else if (is.primitive(element)) {
	        instance = new ReactTextComponent(element);
	    } else if (isInternalComponentType(element.type)) {
	        instance = new ReactClassComponent(element);
	    } else {
	        instance = new ReactDOMComponent(element);
	    }

	    return instance;
	}

	module.exports = instantiateReactComponent;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var is = __webpack_require__(2);

	var REACT_ELEMENT_TYPE = 'react.element';
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var RESERVED_PROPS = {
	    key: true,
	    ref: true,
	    __self: true,
	    __source: true
	};

	function hasValidRef(config) {
	    return is.def(config.ref);
	}

	function hasValidKey(config) {
	    return is.def(config.key);
	}

	var ReactElement = function(type, key, ref, self, source, owner, props) {
	    var element = {
	        $$typeof: REACT_ELEMENT_TYPE,
	        // Built-in properties that belong on the element
	        type: type,
	        key: key,
	        ref: ref,
	        props: props,
	        elm: null
	    };

	    return element;
	};

	ReactElement.createElement = function(type, config, children) {
	    var propName;

	    // Reserved names are extracted
	    var props = {};

	    var key = null;
	    var ref = null;
	    var self = null;
	    var source = null;

	    if (is.def(config)) {
	        if (hasValidRef(config)) {
	            ref = config.ref;
	        }
	        if (hasValidKey(config)) {
	            key = '' + config.key;
	        }

	        self = config.__self === undefined ? null : config.__self;
	        source = config.__source === undefined ? null : config.__source;
	        // Remaining properties are added to a new props object
	        for (propName in config) {
	            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	                props[propName] = config[propName];
	            }
	        }
	    }

	    // Children can be more than one argument, and those are transferred onto
	    // the newly allocated props object.
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

	    // Resolve default props
	    if (type && type.defaultProps) {
	        var defaultProps = type.defaultProps;
	        for (propName in defaultProps) {
	            if (props[propName] === undefined) {
	                props[propName] = defaultProps[propName];
	            }
	        }
	    }
	    return ReactElement(type, key, ref, self, source, null, props);
	};

	/**
	 * Return a function that produces ReactElements of a given type.
	 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
	 */
	ReactElement.createFactory = function(type) {
	    var factory = ReactElement.createElement.bind(null, type);
	    // Expose the type on the factory and the prototype so that it can be
	    // easily accessed on elements. E.g. `<Foo />.type === Foo`.
	    // This should not be named `constructor` since this may not be the function
	    // that created the element, and it may not even be a constructor.
	    // Legacy hook TODO: Warn if this is accessed
	    factory.type = type;
	    return factory;
	};

	ReactElement.isValidElement = function(object) {
	    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	};

	module.exports = ReactElement;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(6);
	var parseVNode = __webpack_require__(7);
	var is = __webpack_require__(2);
	//var instantiateReactComponent = require('./instantiateReactComponent');

	function unmountComponentAtNode(dom) {}

	function createElm(vnode, parent, insertedVnodeQueue) {

	    if (is.undef(vnode)) return document.createDocumentFragment();

	    var i, data = vnode.props;
	    var elm = vnode.elm,
	        instance = vnode._instance,
	        children = vnode.children;

	    if (is.classComponent(instance)) {
	        insertedVnodeQueue.push(vnode);
	        createElm(children, parent, insertedVnodeQueue);
	    } else {
	        if (parent) {
	            api.appendChild(parent, elm);
	        }
	        if (is.def(children)) {
	            if (is.array(children)) {
	                for (i = 0; i < children.length; ++i) {
	                    createElm(children[i], elm, insertedVnodeQueue);
	                }
	            } else {
	                createElm(children, elm, insertedVnodeQueue);
	            }
	        }
	    }

	    return vnode.getDOM();
	}

	function render(vnode, parent) {
	    var i, elm;
	    var insertedVnodeQueue = [];

	    vnode = parseVNode(vnode, {
	        elm: parent
	    });


	    if (is.undef(vnode)) return null;

	    elm = createElm(vnode, null, insertedVnodeQueue);

	    if (parent) {
	        api.insertBefore(parent, elm);
	    }
	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	        var $vnode = insertedVnodeQueue[i]._instance;
	        if ($vnode.componentDidMount) {
	            $vnode.componentDidMount();
	        }
	    }
	    //  console.log(insertedVnodeQueue);

	    return vnode;
	}

	module.exports = {
	    render: render,
	    createElm: createElm
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var api = __webpack_require__(6);
	var parseVNode = __webpack_require__(7);
	var is = __webpack_require__(2);
	//var instantiateReactComponent = require('./instantiateReactComponent');

	function unmountComponentAtNode(dom) {}

	function createElm(vnode, parent, insertedVnodeQueue) {

	    if (is.undef(vnode)) return document.createDocumentFragment();

	    var i, data = vnode.props;
	    var elm = vnode.elm,
	        instance = vnode._instance,
	        children = vnode.children;

	    if (is.classComponent(instance)) {
	        insertedVnodeQueue.push(vnode);
	        createElm(children, parent, insertedVnodeQueue);
	    } else {
	        if (parent) {
	            api.appendChild(parent, elm);
	        }
	        if (is.def(children)) {
	            if (is.array(children)) {
	                for (i = 0; i < children.length; ++i) {
	                    createElm(children[i], elm, insertedVnodeQueue);
	                }
	            } else {
	                createElm(children, elm, insertedVnodeQueue);
	            }
	        }
	    }

	    return vnode.getDOM();
	}

	function render(vnode, parent) {
	    var i, elm;
	    var insertedVnodeQueue = [];

	    vnode = parseVNode(vnode, {
	        elm: parent
	    });


	    if (is.undef(vnode)) return null;

	    elm = createElm(vnode, null, insertedVnodeQueue);

	    if (parent) {
	        api.insertBefore(parent, elm);
	    }
	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	        var $vnode = insertedVnodeQueue[i]._instance;
	        if ($vnode.componentDidMount) {
	            $vnode.componentDidMount();
	        }
	    }
	    //  console.log(insertedVnodeQueue);

	    return vnode;
	}

	module.exports = {
	    render: render,
	    createElm: createElm
	};

/***/ }
/******/ ]);