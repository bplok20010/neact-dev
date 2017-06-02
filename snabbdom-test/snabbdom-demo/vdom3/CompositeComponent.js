/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var BaseCompositeComponent = require('./BaseCompositeComponent');


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
            childs = util.flatten(childs);
        }
        return childs;
    }
});

module.exports = CompositeComponent;