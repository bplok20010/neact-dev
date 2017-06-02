var util = require('./util');
var is = require('./is');

function Component(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;
    this.elm = instance;
    this.dom = instance;
}

util.merge(Component.prototype, {
    _isComponent: true,
    _unmounted: false,
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
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    }
});


module.exports = Component;