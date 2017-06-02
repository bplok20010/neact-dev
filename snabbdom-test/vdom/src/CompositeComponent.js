/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
var vnode = require('./vnode');
var Component = require('./Component');


function CompositeComponent(element) {
    Component.call(this, element);
    //this.elm = null;
    this.dom = null;
    this._instance._instanceCompositeComponent = this;
}
util.inherits(CompositeComponent, Component, {
    _isCompositeComponent: true,
    _getInstance: function() {
        var type = this.type;
        var props = this._currentElement.props;
        return new type(props);
    },
    render: function() {
        var childs = this._instance.render();
        if (is.array(childs)) {
            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        if (is.primitive(childs)) {
            childs = vnode.createTextElement(childs);
        } else if (is.invalid(childs)) {
            childs = vnode.createVoidElement();
        }

        return childs;
    },
    componentWillMount: function() {
        var instance = this._instance;
        if (instance.componentWillMount) {
            instance.componentWillMount();
        }
    },
    componentDidMount: function() {
        var instance = this._instance;
        if (instance.componentDidMount) {
            instance.componentDidMount();
        }
    },
    componentWillReceiveProps: function(nextProps) {
        var instance = this._instance;
        if (instance.componentWillReceiveProps) {
            instance.componentWillReceiveProps(nextProps);
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        var instance = this._instance;
        if (instance.shouldComponentUpdate) {
            return instance.shouldComponentUpdate(nextProps, nextState);
        }
    },
    componentWillUpdate: function(nextProps, nextState) {
        var instance = this._instance;
        if (instance.componentWillUpdate) {
            instance.componentWillUpdate(nextProps, nextState);
        }
    },
    componentDidUpdate: function(nextProps, nextState) {
        var instance = this._instance;
        if (instance.componentDidUpdate) {
            instance.componentDidUpdate(nextProps, nextState);
        }
    }
});

module.exports = CompositeComponent;