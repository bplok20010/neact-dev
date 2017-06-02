/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var Component = require('./Component');

function EmptyComponent(element) {
    this.props = {};
    this._currentElement = null;
    var instance = this._getInstance();
    this.elm = instance;
    this.dom = instance;
}
util.inherits(EmptyComponent, Component, {
    _isEmptyComponent: true,
    _getInstance: function() {
        return document.createComment('empty-node');
    }
});

module.exports = EmptyComponent;