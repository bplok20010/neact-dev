'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _snabbdomJsx = require('snabbdom-jsx');

var _snabbdom = require('../snabbdom');

var _snabbdom2 = _interopRequireDefault(_snabbdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

////..
/** @jsx html */

var patch = _snabbdom2['default'].init([require('../snabbdom/modules/class'), require('../snabbdom/modules/props'), require('../snabbdom/modules/style'), require('../snabbdom/modules/attributes'), require('../snabbdom/modules/eventlisteners')]);

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