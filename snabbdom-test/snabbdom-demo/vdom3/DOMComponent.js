/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var BaseCompositeComponent = require('./BaseCompositeComponent');


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
            childs = util.flatten(childs);
        }
        return childs;
    }
});

module.exports = DOMComponent;