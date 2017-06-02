/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var vnode = require('./vnode');
var BaseCompositeComponent = require('./Component');


function DOMComponent(element) {
    BaseCompositeComponent.call(this, element);
}
util.inherits(DOMComponent, BaseCompositeComponent, {
    _getInstance: function() {
        return document.createElement(this.type);
    },
    render: function() {
        var childs = this._currentElement.props.children;
        if (is.array(childs)) {
            childs = util.map(util.flatten(childs), function(node) {
                if (is.primitive(node)) {
                    return vnode.createTextElement(node);
                }
                return node;
            });
        } else {
            if (is.primitive(childs)) {
                childs = vnode.createTextElement(childs);
            }
        }
        return childs;
    }
});

module.exports = DOMComponent;