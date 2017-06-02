/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
//var is = require('./is');
var BaseCompositeComponent = require('./BaseCompositeComponent');

function TextDOMComponent(element) {
    this.text = element.props.text;
    BaseCompositeComponent.call(this, element);
}
util.inherits(TextDOMComponent, BaseCompositeComponent, {
    _getInstance: function() {
        return document.createTextNode(this._currentElement.props.text);
    }
});

module.exports = TextDOMComponent;