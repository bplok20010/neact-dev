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

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _snabbdomJsx = __webpack_require__(2);

	var _snabbdom = __webpack_require__(3);

	var _snabbdom2 = _interopRequireDefault(_snabbdom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	////..
	/** @jsx html */

	var patch = _snabbdom2['default'].init([__webpack_require__(7), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11)]);

	var idx = 1;
	var li = [];
	var listNode = render();

	patch(document.getElementById('list'), listNode);

	function addItem() {
		li.push(idx++);
		var newNode = render();
		listNode = patch(listNode, newNode);
	}

	var g = 100;

	function repaceIdx() {
		li = li.map(function (d, i) {
			return d + g++;
		});
		var newNode = render();
		listNode = patch(listNode, newNode);
	}

	function delItem(i) {
		li.splice(i, 1);
		var newNode = render();
		listNode = patch(listNode, newNode);
	}

	function render() {
		var lis = li.map(function (d, i) {
			return (0, _snabbdomJsx.html)(
				'li',
				{ key: i },
				i,
				'=>',
				d,
				'------',
				(0, _snabbdomJsx.html)(
					'span',
					{ 'on-click': function onClick(index) {
							return delItem(index);
						}, style: { cursor: 'pointer' } },
					'x'
				)
			);
		});
		return (0, _snabbdomJsx.html)(
			'div',
			null,
			(0, _snabbdomJsx.html)(
				'button',
				{ 'on-click': addItem },
				'\u65B0\u589E'
			),
			(0, _snabbdomJsx.html)(
				'button',
				{ 'on-click': repaceIdx },
				'\u91CD\u8BBE'
			),
			(0, _snabbdomJsx.html)(
				'ul',
				null,
				lis
			)
		);
	}

	//on-click={ _ => alert('Hi ' + name) }
	//HelloMessage : (attrs, body) -> vnode
	var HelloMessage = function HelloMessage(data, p) {
		var name = data.name;
		return (0, _snabbdomJsx.html)(
			'div',
			{ id: 'test', attrs: { 'shref': data.cid } },
			name,
			(0, _snabbdomJsx.html)(
				'div',
				null,
				p
			),
			'0999'
		);
	};

	var time = ~~(+new Date() / 1000);

	var test = (0, _snabbdomJsx.html)(
		'div',
		null,
		'Hello JSX',
		time
	);

	var i = 1;

	var vnode = (0, _snabbdomJsx.html)(
		HelloMessage,
		{ name: 'Yassine', cid: i },
		'a',
		(0, _snabbdomJsx.html)(
			'div',
			null,
			'1'
		),
		test,
		(0, _snabbdomJsx.html)(
			'div',
			null,
			'2'
		),
		'b'
	);

	setInterval(function () {
		var time = ~~(+new Date() / 1000);
		var test = (0, _snabbdomJsx.html)(
			'div',
			null,
			'Hello JSX',
			time
		);
		i++;
		var newNode = (0, _snabbdomJsx.html)(
			HelloMessage,
			{ name: 'Yassine', cid: i },
			'a',
			(0, _snabbdomJsx.html)(
				'div',
				null,
				'1'
			),
			test,
			(0, _snabbdomJsx.html)(
				'div',
				null,
				'2'
			),
			'b'
		);
		vnode = patch(vnode, newNode);
	}, 1000);

	patch(document.getElementById('placeholder'), vnode);

	var TreeStore = [{
		text: '跟节点',
		children: [{ text: '文件夹<strong>A</strong>', expand: false, children: [{ text: '文件.txt' }], leaf: false }, { text: '文件夹B', leaf: false, children: [{ text: '文件夹X', leaf: false }] }, { text: '文件夹C', leaf: false }, { text: '文件夹D', leaf: false }].concat(function () {
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

	var Tree = function () {
		function Tree(data) {
			(0, _classCallCheck3['default'])(this, Tree);

			this.data = data;
			this.getTreeView();
			console.time('renderTree');
			this.vnode = patch(document.getElementById('tree'), this.render());
			console.timeEnd('renderTree');
			this.idx = 1;
		}

		Tree.prototype.isLeaf = function isLeaf(node) {
			return node.leaf === undefined ? true : node.leaf;
		};

		Tree.prototype.addChild = function addChild(pnode) {
			if (!pnode.children) {
				pnode.children = [];
			}

			pnode.children.push({
				text: '文件' + this.idx++
			});

			pnode.expand = true;

			this.forceUpdate();
		};

		Tree.prototype.removeChild = function removeChild(childs, i) {

			childs.splice(i, 1);

			this.forceUpdate();
		};
		//


		Tree.prototype.getChildItem = function getChildItem(data) {
			var _this = this;

			var child = data.children;
			if (!child) return [];
			return (0, _snabbdomJsx.html)(
				'ul',
				{ style: { display: data.expand === false ? 'none' : 'block' } },
				child.map(function (node, i) {
					return (0, _snabbdomJsx.html)(
						'li',
						{ key: i },
						(0, _snabbdomJsx.html)(
							'div',
							null,
							node.text,
							' ',
							_this.isLeaf(node) ? (0, _snabbdomJsx.html)(
								'span',
								{ style: { cursor: 'pointer' }, 'on-click': function onClick() {
										return _this.removeChild(child, i);
									} },
								'-'
							) : (0, _snabbdomJsx.html)(
								'span',
								{ style: { cursor: 'pointer' }, 'on-click': function onClick() {
										return _this.addChild(node);
									} },
								'+'
							)
						),
						_this.getChildItem(node)
					);
				})
			);
		};

		Tree.prototype.getTreeView = function getTreeView() {
			return this.getChildItem(this.data[0]);
		};

		Tree.prototype.render = function render() {
			return this.getTreeView();
		};

		Tree.prototype.forceUpdate = function forceUpdate() {
			console.time('renderTree');
			this.vnode = patch(this.vnode, this.render());
			console.timeEnd('renderTree');
		};

		return Tree;
	}();

	var tree = new Tree(TreeStore);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var SVGNS = 'http://www.w3.org/2000/svg';
	var modulesNS = ['hook', 'on', 'style', 'class', 'props', 'attrs'];
	var slice = Array.prototype.slice;

	function isPrimitive(val) {
	  return  typeof val === 'string'   ||
	          typeof val === 'number'   ||
	          typeof val === 'boolean'  ||
	          typeof val === 'symbol'   ||
	          val === null              ||
	          val === undefined;
	}

	function normalizeAttrs(attrs, nsURI, defNS, modules) {
	  var map = { ns: nsURI };
	  for (var i = 0, len = modules.length; i < len; i++) {
	    var mod = modules[i];
	    if(attrs[mod])
	      map[mod] = attrs[mod];
	  }
	  for(var key in attrs) {
	    if(key !== 'key' && key !== 'classNames' && key !== 'selector') {
	      var idx = key.indexOf('-');
	      if(idx > 0)
	        addAttr(key.slice(0, idx), key.slice(idx+1), attrs[key]);
	      else if(!map[key])
	        addAttr(defNS, key, attrs[key]);
	    }
	  }
	  return map;

	  function addAttr(namespace, key, val) {
	    var ns = map[namespace] || (map[namespace] = {});
	    ns[key] = val;
	  }
	}

	function buildFromStringTag(nsURI, defNS, modules, tag, attrs, children) {

	  if(attrs.selector) {
	    tag = tag + attrs.selector;
	  }
	  if(attrs.classNames) {
	    var cns = attrs.classNames;
	    tag = tag + '.' + (
	      Array.isArray(cns) ? cns.join('.') : cns.replace(/\s+/g, '.')
	    );
	  }

	  return {
	    sel       : tag,
	    data      : normalizeAttrs(attrs, nsURI, defNS, modules),
	    children  : children.map( function(c) {
	      return isPrimitive(c) ? {text: c} : c;
	    }),
	    key: attrs.key
	  };
	}

	function buildFromComponent(nsURI, defNS, modules, tag, attrs, children) {
	  var res;
	  if(typeof tag === 'function'){
			if( tag.prototype.$vcomponent ) {
	      res = buildFromStringTag(nsURI, defNS, modules, tag, attrs, children);
			} else {
	    	res = tag(attrs, children);
			}
		}else if(tag && typeof tag.view === 'function')
	    res = tag.view(attrs, children);
	  else if(tag && typeof tag.render === 'function')
	    res = tag.render(attrs, children);
	  else
	    throw "JSX tag must be either a string, a function or an object with 'view' or 'render' methods";
	  res.key = attrs.key;
	  return res;
	}

	function flatten(nested, start, flat) {
	  for (var i = start, len = nested.length; i < len; i++) {
	    var item = nested[i];
	    if (Array.isArray(item)) {
	      flatten(item, 0, flat);
	    } else {
	      flat.push(item);
	    }
	  }
	}

	function maybeFlatten(array) {
	  if (array) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (Array.isArray(array[i])) {
	        var flat = array.slice(0, i);
	        flatten(array, i, flat);
	        array = flat;
	        break;
	      }
	    }
	  }
	  return array;
	}

	function buildVnode(nsURI, defNS, modules, tag, attrs, children) {
	  attrs = attrs || {};
	  children = maybeFlatten(children);
	  if(typeof tag === 'string') {
	    return buildFromStringTag(nsURI, defNS, modules, tag, attrs, children)
	  } else {
	    return buildFromComponent(nsURI, defNS, modules, tag, attrs, children)
	  }
	}

	function JSX(nsURI, defNS, modules) {
	  return function jsxWithCustomNS(tag, attrs, children) {
	    if(arguments.length > 3 || !Array.isArray(children))
	      children = slice.call(arguments, 2);
	    return buildVnode(nsURI, defNS || 'props', modules || modulesNS, tag, attrs, children);
	  };
	}

	module.exports = {
	  html: JSX(undefined),
	  svg: JSX(SVGNS, 'attrs'),
	  JSX: JSX
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// jshint newcap: false
	/* global require, module, document, Node */
	'use strict';

	var VNode = __webpack_require__(4);
	var is = __webpack_require__(5);
	var domApi = __webpack_require__(6);

	function isUndef(s) { return s === undefined; }

	function isDef(s) { return s !== undefined; }

	var emptyNode = VNode('', {}, [], undefined, undefined);

	function sameVnode(vnode1, vnode2) {
	    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}

	function createKeyToOldIdx(children, beginIdx, endIdx) {
	    var i, map = {},
	        key;
	    for (i = beginIdx; i <= endIdx; ++i) {
	        key = children[i].key;
	        if (isDef(key)) map[key] = i;
	    }
	    return map;
	}

	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

	function init(modules, api) {
	    var i, j, cbs = {};

	    if (isUndef(api)) api = domApi;

	    for (i = 0; i < hooks.length; ++i) {
	        cbs[hooks[i]] = [];
	        for (j = 0; j < modules.length; ++j) {
	            if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	        }
	    }

	    function emptyNodeAt(elm) {
	        var id = elm.id ? '#' + elm.id : '';
	        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
	        return VNode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
	    }

	    function createRmCb(childElm, listeners) {
	        return function() {
	            if (--listeners === 0) {
	                var parent = api.parentNode(childElm);
	                api.removeChild(parent, childElm);
	            }
	        };
	    }

	    function createElm(vnode, insertedVnodeQueue) {
	        var i, data = vnode.data;
	        if (isDef(data)) {
	            if (isDef(i = data.hook) && isDef(i = i.init)) {
	                i(vnode);
	                data = vnode.data;
	            }
	        }
	        var elm, children = vnode.children,
	            sel = vnode.sel;
	        if (isDef(sel)) {
	            // Parse selector
	            var hashIdx = sel.indexOf('#');
	            var dotIdx = sel.indexOf('.', hashIdx);
	            var hash = hashIdx > 0 ? hashIdx : sel.length;
	            var dot = dotIdx > 0 ? dotIdx : sel.length;
	            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	            elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) :
	                api.createElement(tag);
	            if (hash < dot) elm.id = sel.slice(hash + 1, dot);
	            if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
	            if (is.array(children)) {
	                for (i = 0; i < children.length; ++i) {
	                    api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	                }
	            } else if (is.primitive(vnode.text)) {
	                api.appendChild(elm, api.createTextNode(vnode.text));
	            }
	            for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
	            i = vnode.data.hook; // Reuse variable
	            if (isDef(i)) {
	                if (i.create) i.create(emptyNode, vnode);
	                if (i.insert) insertedVnodeQueue.push(vnode);
	            }
	        } else {
	            elm = vnode.elm = api.createTextNode(vnode.text);
	        }
	        return vnode.elm;
	    }

	    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	        for (; startIdx <= endIdx; ++startIdx) {
	            api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	        }
	    }

	    function invokeDestroyHook(vnode) {
	        var i, j, data = vnode.data;
	        if (isDef(data)) {
	            if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	            for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
	            if (isDef(i = vnode.children)) {
	                for (j = 0; j < vnode.children.length; ++j) {
	                    invokeDestroyHook(vnode.children[j]);
	                }
	            }
	        }
	    }

	    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	        for (; startIdx <= endIdx; ++startIdx) {
	            var i, listeners, rm, ch = vnodes[startIdx];
	            if (isDef(ch)) {
	                if (isDef(ch.sel)) {
	                    invokeDestroyHook(ch);
	                    listeners = cbs.remove.length + 1;
	                    rm = createRmCb(ch.elm, listeners);
	                    for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
	                    if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	                        i(ch, rm);
	                    } else {
	                        rm();
	                    }
	                } else { // Text node
	                    api.removeChild(parentElm, ch.elm);
	                }
	            }
	        }
	    }
	    /**
	     * 
	     */
	    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	        var oldStartIdx = 0,
	            newStartIdx = 0;
	        var oldEndIdx = oldCh.length - 1;
	        var oldStartVnode = oldCh[0];
	        var oldEndVnode = oldCh[oldEndIdx];
	        var newEndIdx = newCh.length - 1;
	        var newStartVnode = newCh[0];
	        var newEndVnode = newCh[newEndIdx];
	        var oldKeyToIdx, idxInOld, elmToMove, before;
	        //开始循环
	        //当新旧任意一个检测完后就退出
	        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	            if (isUndef(oldStartVnode)) { //对于undefind的子节点字节跳过
	                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	            } else if (isUndef(oldEndVnode)) { //对于undefind的子节点字节跳过
	                oldEndVnode = oldCh[--oldEndIdx];
	            } else if (sameVnode(oldStartVnode, newStartVnode)) { //是否相同KEY
	                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	                oldStartVnode = oldCh[++oldStartIdx];
	                newStartVnode = newCh[++newStartIdx];
	            } else if (sameVnode(oldEndVnode, newEndVnode)) {
	                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	                oldEndVnode = oldCh[--oldEndIdx];
	                newEndVnode = newCh[--newEndIdx];
	            } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	                oldStartVnode = oldCh[++oldStartIdx];
	                newEndVnode = newCh[--newEndIdx];
	            } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	                oldEndVnode = oldCh[--oldEndIdx];
	                newStartVnode = newCh[++newStartIdx];
	            } else {
	                if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	                idxInOld = oldKeyToIdx[newStartVnode.key];
	                if (isUndef(idxInOld)) { // New element
	                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	                    newStartVnode = newCh[++newStartIdx];
	                } else {
	                    elmToMove = oldCh[idxInOld];
	                    patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	                    oldCh[idxInOld] = undefined;
	                    api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	                    newStartVnode = newCh[++newStartIdx];
	                }
	            }
	        }

	        if (oldStartIdx > oldEndIdx) {
	            before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	        } else if (newStartIdx > newEndIdx) {
	            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	        }
	    }

	    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	        var i, hook;
	        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	            i(oldVnode, vnode);
	        }
	        var elm = vnode.elm = oldVnode.elm,
	            oldCh = oldVnode.children,
	            ch = vnode.children;
	        if (oldVnode === vnode) return;
	        if (!sameVnode(oldVnode, vnode)) {
	            var parentElm = api.parentNode(oldVnode.elm);
	            elm = createElm(vnode, insertedVnodeQueue);
	            api.insertBefore(parentElm, elm, oldVnode.elm);
	            removeVnodes(parentElm, [oldVnode], 0, 0);
	            return;
	        }
	        if (isDef(vnode.data)) {
	            for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
	            i = vnode.data.hook;
	            if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	        }
	        //优先级 vnode.text > vnode.children
	        if (isUndef(vnode.text)) {
	            if (isDef(oldCh) && isDef(ch)) {
	                //如果新旧vdom都存在子节点则调用updateChildren进行
	                if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	            } else if (isDef(ch)) { //old vdom无children时
	                //清空old vdom的文本内容
	                if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	                //把new vdom的children直接插入到elm
	                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	            } else if (isDef(oldCh)) {
	                //new vdom不存在children时
	                //删除vdom.elm下所有节点 并调用相应的hook
	                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	            } else if (isDef(oldVnode.text)) {
	                //old vdom还存在text 也清空
	                api.setTextContent(elm, '');
	            }
	        } else if (oldVnode.text !== vnode.text) {
	            api.setTextContent(elm, vnode.text);
	        }
	        if (isDef(hook) && isDef(i = hook.postpatch)) {
	            i(oldVnode, vnode);
	        }
	    }

	    return function(oldVnode, vnode) {
	        var i, elm, parent;
	        var insertedVnodeQueue = [];
	        for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

	        if (isUndef(oldVnode.sel)) {
	            oldVnode = emptyNodeAt(oldVnode);
	        }

	        if (sameVnode(oldVnode, vnode)) {
	            patchVnode(oldVnode, vnode, insertedVnodeQueue);
	        } else {
	            elm = oldVnode.elm;
	            parent = api.parentNode(elm);

	            createElm(vnode, insertedVnodeQueue);

	            if (parent !== null) {
	                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	                removeVnodes(parent, [oldVnode], 0, 0);
	            }
	        }

	        for (i = 0; i < insertedVnodeQueue.length; ++i) {
	            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	        }
	        for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
	        return vnode;
	    };
	}

	module.exports = { init: init };

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return {sel: sel, data: data, children: children,
	          text: text, elm: elm, key: key};
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
	  array: Array.isArray,
	  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	function createElement(tagName){
	  return document.createElement(tagName);
	}

	function createElementNS(namespaceURI, qualifiedName){
	  return document.createElementNS(namespaceURI, qualifiedName);
	}

	function createTextNode(text){
	  return document.createTextNode(text);
	}


	function insertBefore(parentNode, newNode, referenceNode){
	  parentNode.insertBefore(newNode, referenceNode);
	}


	function removeChild(node, child){
	  node.removeChild(child);
	}

	function appendChild(node, child){
	  node.appendChild(child);
	}

	function parentNode(node){
	  return node.parentElement;
	}

	function nextSibling(node){
	  return node.nextSibling;
	}

	function tagName(node){
	  return node.tagName;
	}

	function setTextContent(node, text){
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
/***/ function(module, exports) {

	function updateClass(oldVnode, vnode) {
	  var cur, name, elm = vnode.elm,
	      oldClass = oldVnode.data["class"],
	      klass = vnode.data["class"];

	  if (!oldClass && !klass) return;
	  oldClass = oldClass || {};
	  klass = klass || {};

	  for (name in oldClass) {
	    if (!klass[name]) {
	      elm.classList.remove(name);
	    }
	  }
	  for (name in klass) {
	    cur = klass[name];
	    if (cur !== oldClass[name]) {
	      elm.classList[cur ? 'add' : 'remove'](name);
	    }
	  }
	}

	module.exports = {create: updateClass, update: updateClass};


/***/ },
/* 8 */
/***/ function(module, exports) {

	function updateProps(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldProps = oldVnode.data.props, props = vnode.data.props;

	  if (!oldProps && !props) return;
	  oldProps = oldProps || {};
	  props = props || {};

	  for (key in oldProps) {
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}

	module.exports = {create: updateProps, update: updateProps};


/***/ },
/* 9 */
/***/ function(module, exports) {

	var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
	var nextFrame = function(fn) { raf(function() { raf(fn); }); };

	function setNextFrame(obj, prop, val) {
	  nextFrame(function() { obj[prop] = val; });
	}

	function updateStyle(oldVnode, vnode) {
	  var cur, name, elm = vnode.elm,
	      oldStyle = oldVnode.data.style,
	      style = vnode.data.style;

	  if (!oldStyle && !style) return;
	  oldStyle = oldStyle || {};
	  style = style || {};
	  var oldHasDel = 'delayed' in oldStyle;

	  for (name in oldStyle) {
	    if (!style[name]) {
	      elm.style[name] = '';
	    }
	  }
	  for (name in style) {
	    cur = style[name];
	    if (name === 'delayed') {
	      for (name in style.delayed) {
	        cur = style.delayed[name];
	        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
	          setNextFrame(elm.style, name, cur);
	        }
	      }
	    } else if (name !== 'remove' && cur !== oldStyle[name]) {
	      elm.style[name] = cur;
	    }
	  }
	}

	function applyDestroyStyle(vnode) {
	  var style, name, elm = vnode.elm, s = vnode.data.style;
	  if (!s || !(style = s.destroy)) return;
	  for (name in style) {
	    elm.style[name] = style[name];
	  }
	}

	function applyRemoveStyle(vnode, rm) {
	  var s = vnode.data.style;
	  if (!s || !s.remove) {
	    rm();
	    return;
	  }
	  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
	      compStyle, style = s.remove, amount = 0, applied = [];
	  for (name in style) {
	    applied.push(name);
	    elm.style[name] = style[name];
	  }
	  compStyle = getComputedStyle(elm);
	  var props = compStyle['transition-property'].split(', ');
	  for (; i < props.length; ++i) {
	    if(applied.indexOf(props[i]) !== -1) amount++;
	  }
	  elm.addEventListener('transitionend', function(ev) {
	    if (ev.target === elm) --amount;
	    if (amount === 0) rm();
	  });
	}

	module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};


/***/ },
/* 10 */
/***/ function(module, exports) {

	var NamespaceURIs = {
	  "xlink": "http://www.w3.org/1999/xlink"
	};

	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
	                "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
	                "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
	                "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
	                "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
	                "truespeed", "typemustmatch", "visible"];

	var booleanAttrsDict = Object.create(null);
	for(var i=0, len = booleanAttrs.length; i < len; i++) {
	  booleanAttrsDict[booleanAttrs[i]] = true;
	}

	function updateAttrs(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs, namespaceSplit;

	  if (!oldAttrs && !attrs) return;
	  oldAttrs = oldAttrs || {};
	  attrs = attrs || {};

	  // update modified attributes, add new attributes
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      if(!cur && booleanAttrsDict[key])
	        elm.removeAttribute(key);
	      else {
	        namespaceSplit = key.split(":");
	        if(namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0]))
	          elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);
	        else
	          elm.setAttribute(key, cur);
	      }
	    }
	  }
	  //remove removed attributes
	  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	  // the other option is to remove all attributes with value == undefined
	  for (key in oldAttrs) {
	    if (!(key in attrs)) {
	      elm.removeAttribute(key);
	    }
	  }
	}

	module.exports = {create: updateAttrs, update: updateAttrs};


/***/ },
/* 11 */
/***/ function(module, exports) {

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
	        invokeHandler(handler[i]);
	      }
	    }
	  }
	}

	function handleEvent(event, vnode) {
	  var name = event.type,
	      on = vnode.data.on;

	  // call event handler(s) if exists
	  if (on && on[name]) {
	    invokeHandler(on[name], vnode, event);
	  }
	}

	function createListener() {
	  return function handler(event) {
	    handleEvent(event, handler.vnode);
	  }
	}

	function updateEventListeners(oldVnode, vnode) {
	  var oldOn = oldVnode.data.on,
	      oldListener = oldVnode.listener,
	      oldElm = oldVnode.elm,
	      on = vnode && vnode.data.on,
	      elm = vnode && vnode.elm,
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
	        oldElm.removeEventListener(name, oldListener, false);
	      }
	    } else {
	      for (name in oldOn) {
	        // remove listener if existing listener removed
	        if (!on[name]) {
	          oldElm.removeEventListener(name, oldListener, false);
	        }
	      }
	    }
	  }

	  // add new listeners which has not already attached
	  if (on) {
	    // reuse existing listener or create new
	    var listener = vnode.listener = oldVnode.listener || createListener();
	    // update vnode for listener
	    listener.vnode = vnode;

	    // if element changed or added we add all needed listeners unconditionally
	    if (!oldOn) {
	      for (name in on) {
	        // add listener if element was changed or new listeners added
	        elm.addEventListener(name, listener, false);
	      }
	    } else {
	      for (name in on) {
	        // add listener if new listener added
	        if (!oldOn[name]) {
	          elm.addEventListener(name, listener, false);
	        }
	      }
	    }
	  }
	}

	module.exports = {
	  create: updateEventListeners,
	  update: updateEventListeners,
	  destroy: updateEventListeners
	};


/***/ }
/******/ ]);