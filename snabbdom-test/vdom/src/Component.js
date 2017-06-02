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