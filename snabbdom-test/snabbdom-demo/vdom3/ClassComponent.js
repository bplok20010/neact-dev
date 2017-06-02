/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var React = require('./ReactClass');
var ReactElement = require('./ReactElement');
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
    isBaseComponent: true,
    render: function() {
        return null;
    },
    setProps: function(props) {
        this._currentElement.props = props;
    },
    getDOM: function() {
        if (!is.classComponent) return this.elm;

        var vnode = this,
            dom = vnode.elm;

        while (!dom && (vnode = (is.array(vnode.children) ? vnode.children[0] : vnode.children))) {
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
    setProps: function(props) {
        this._instance.props = props;
    },
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