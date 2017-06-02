/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var Component = require('./Component');

function TextDOMComponent(element) {
    this.text = element.props.text;
    Component.call(this, element);
}
util.inherits(TextDOMComponent, Component, {
    _isDOMTextComponent: true,
    _getInstance: function() {
        return document.createTextNode(this._currentElement.props.text);
    }
});

module.exports = TextDOMComponent;