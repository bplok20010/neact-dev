'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx Neact.createElement */

var num = 0;
//1
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

var TreeItem = function (_Neact$Component) {
    _inherits(TreeItem, _Neact$Component);

    function TreeItem() {
        _classCallCheck(this, TreeItem);

        return _possibleConstructorReturn(this, _Neact$Component.apply(this, arguments));
    }

    TreeItem.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.children != nextProps.children;
    };

    TreeItem.prototype.render = function render() {
        var _this3 = this;

        var text = this.props.stext;
        return Neact.createElement(
            'li',
            { idx: this.props.idx },
            Neact.createElement(
                'div',
                null,
                text,
                Neact.createElement('span', { style: 'cursor:pointer', onClick: function onClick() {
                        return _this3.props.onRemove();
                    }, dangerouslySetInnerHTML: { __html: '<b>-</b>' } }),
                Neact.createElement(
                    'span',
                    { style: 'cursor:pointer', onClick: function onClick() {
                            return _this3.props.onAdd();
                        } },
                    ' +'
                )
            ),
            this.props.children
        );
    };

    return TreeItem;
}(Neact.Component);

var TreeNode = function (_Neact$Component2) {
    _inherits(TreeNode, _Neact$Component2);

    function TreeNode() {
        _classCallCheck(this, TreeNode);

        var _this4 = _possibleConstructorReturn(this, _Neact$Component2.apply(this, arguments));

        _this4.state = {
            idx: 1
        };
        return _this4;
    }

    TreeNode.prototype.addChild = function addChild(pnode) {
        if (!pnode.children) {
            pnode.children = [];
        }

        pnode.children.push({
            text: '文件' + this.state.idx++
        });

        pnode.children = [].concat(pnode.children);

        pnode.expand = true;

        console.time('tree');
        this.props.updateFn();
        console.timeEnd('tree');
    };

    TreeNode.prototype.removeChild = function removeChild(d, i) {

        if (!d.children) return;
        d.children.splice(i, 1);
        if (!d.children.length) d.children = null;
        console.time('tree');
        // this.props.updateFn();
        this.forceUpdate();
        console.timeEnd('tree');
    };

    TreeNode.prototype.render = function render() {
        var _this = this;
        var node = this.props.node;
        var returnValue = null;
        if (node.children) {
            returnValue = Neact.createElement(
                'ul',
                null,
                Neact.util.map(node.children, function (d, i) {
                    if (!d) return null;
                    return Neact.createElement(
                        TreeItem,
                        { key: i, node: d, idx: i, stext: d.text, onAdd: function onAdd() {
                                return _this.addChild(d);
                            }, onRemove: function onRemove() {
                                return _this.removeChild(node, i);
                            } },
                        !d.children ? null : Neact.createElement(TreeNode, { node: d, updateFn: function updateFn() {
                                return _this.forceUpdate();
                            } })
                    );
                })
            );
        } else {
            returnValue = Neact.createElement(
                TreeItem,
                { stext: node.text, onAdd: function onAdd() {
                        return _this.addChild(node);
                    }, onRemove: function onRemove() {
                        return _this.removeChild(node, i);
                    } },
                null
            );
        }
        return returnValue;
    };

    return TreeNode;
}(Neact.Component);

var Tree = Neact.createClass({

    isLeaf: function isLeaf(node) {
        return node.leaf === undefined ? true : node.leaf;
    },

    render: function render() {
        var _this5 = this;

        return Neact.createElement(TreeNode, { node: this.props.data[0], updateFn: function updateFn() {
                return _this5.forceUpdate();
            } });
    },

    componentDidMount: function componentDidMount() {
        // setInterval(()=> this.forceUpdate(), 1000)
    }
});

var vnode = Neact.createElement(
    'div',
    null,
    Neact.createElement(Tree, { data: TreeStore })
);

var render = Neact.render(vnode, document.body);

//var render1 = Neact.render(Neact.createElement(A1), document.body);


window.render = render;