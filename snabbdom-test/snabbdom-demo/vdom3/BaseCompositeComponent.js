var util = require('./util');
var is = require('./is');

function BaseCompositeComponent(element) {
    this.key = element.key;
    this.type = element.type;
    this._currentElement = element;
    var instance = this._getInstance();
    this._instance = instance;
    this.elm = instance;
}

util.merge(BaseCompositeComponent.prototype, {
    _getInstance: function() {
        throw new TypeError('abstract method');
    },
    render: function() {
        return null;
    },
    getElement: function() {
        return this._currentElement;
    },
    setProps: function(props) {
        return this._currentElement.props = props;
    },
    getProps: function() {
        return this._currentElement.props;
    },
    getDOM: function() {
        if (!is.compositeComponent(this)) return this.elm;

        var vnode = this,
            dom = vnode.elm;

        while (!dom && (vnode = (is.array(vnode.children) ? vnode.children[0] : vnode.children))) {
            dom = vnode.elm;
        }

        return dom;
    },
    getParentDOM: function() {
        if (!is.compositeComponent(this)) return this.elm;
        var vnode = this,
            dom = vnode.elm;

        while (!dom && (vnode = vnode.parentNode)) {
            dom = vnode.elm;
        }

        if (!dom) {
            dom = this.getDOM();
            if (dom) {
                dom = dom.parentNode;
            }
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


module.exports = BaseCompositeComponent;