/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
//var Component = require('./Component');

function NeactTextDOMComponent(element) {
    this.text = element.props.text;
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    //this._instance = instance;
    ////this.elm = instance;
    this.dom = instance;
}
util.assign(NeactTextDOMComponent.prototype, {
    _isComponent: true,
    _unmounted: true,
    _isDOMTextComponent: true,
    _getInstance: function() {
        return document.createTextNode(this.text);
    },
    getDOM: function() {
        return this.dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    }
});

module.exports = NeactTextDOMComponent;