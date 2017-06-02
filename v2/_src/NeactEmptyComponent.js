/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');
var is = require('./is');

function NeactEmptyComponent(element) {
    this.props = {};
    this._currentElement = null;
    var instance = this._getInstance();
    //this.elm = instance;
    this.dom = instance;
}

util.assign(NeactEmptyComponent.prototype, {
    _isComponent: true,
    _unmounted: true,
    _isEmptyComponent: true,
    _getInstance: function() {
        return document.createComment('empty-node');
    },
    getDOM: function() {
        return this.dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    }
});

module.exports = NeactEmptyComponent;