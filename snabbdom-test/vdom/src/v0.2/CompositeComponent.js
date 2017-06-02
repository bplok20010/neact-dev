/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var vnode = require('./vnode');
var BaseCompositeComponent = require('./Component');


function CompositeComponent(element) {
    BaseCompositeComponent.call(this, element);
    this.elm = null;
    this._instance._instanceCompositeComponent = this;
}
util.inherits(CompositeComponent, BaseCompositeComponent, {
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

module.exports = CompositeComponent;