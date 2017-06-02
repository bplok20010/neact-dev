/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var BaseCompositeComponent = require('./Component');


function EmptyComponent(element) {}
util.inherits(EmptyComponent, BaseCompositeComponent, {
    _isEmptyComponent: true,
    _getInstance: function() {
        return document.createComment('EMPTY NODE');
    }
});

module.exports = EmptyComponent;