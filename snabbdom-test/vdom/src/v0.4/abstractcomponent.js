var util = require('./util');
var is = require('./is');
var vnode = require('./vnode');

function Component(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this.vnode = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;
    this.elm = instance;
    this.dom = instance;
}

util.assign(Component.prototype, {
    _isComponent: true,
    _getInstance: function() {
        throw new TypeError('abstract method');
    },
    render: function() {
        return null;
    },
    getVNode: function() {
        return this._currentElement;
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
    }
});


function CompositeComponent(element) {
    Component.call(this, element);
    this.elm = null;
    this.dom = null;
    this._instance._instanceCompositeComponent = this;
}
util.inherits(CompositeComponent, Component, {
    _isCompositeComponent: true,
    _getInstance: function() {
        return new this.type(this._currentElement.props);
    },
    render: function() {
        var childs = this._instance.render();
        if (is.array(childs)) {
            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        if (is.primitive(childs)) {
            childs = vnode.createTextElement(childs);
        }
        return childs;
    }
});


module.exports = Component;