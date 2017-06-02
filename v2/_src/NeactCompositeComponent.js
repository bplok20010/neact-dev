/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
'use strict';
var util = require('./util');
var is = require('./is');
var NeactCurrentOwner = require('./NeactCurrentOwner');
var NeactRefsMixin = require('./NeactRefsMixin');

function NeactCompositeComponent(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;

    this.dom = null;
    this._instance._instanceCompositeComponent = this;
}

util.assign(NeactCompositeComponent.prototype, NeactRefsMixin, {
    _isComponent: true,
    _unmounted: true,
    _isCompositeComponent: true,
    _nextState: null,
    _getInstance: function() {
        var type = this.type;
        var props = this._currentElement.props;
        return new type(props);
    },

    getPublicInstance: function() {
        return this._instance;
    },

    getDOM: function() {
        var inst = this,
            dom = inst.dom;

        while (!dom && (inst = inst.children)) {
            dom = inst.dom;
        }

        return dom;
    },
    getParentDOM: function() {
        var dom = this.getDOM();
        return dom ? dom.parentNode : null;
    },
    render: function() {

        NeactCurrentOwner.current = this;

        var childs = this._instance.render();

        NeactCurrentOwner.current = null;

        if (is.array(childs)) {
            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }

        return childs;
    },

    componentWillMount: function() {
        var vnode = this._instance;
        if (vnode.componentWillMount) {
            vnode.componentWillMount();
        }
    },

    componentDidMount: function() {
        var vnode = this._instance;

        if (vnode.componentDidMount) {
            vnode.componentDidMount();
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var vnode = this._instance;
        if (vnode.componentWillReceiveProps) {
            vnode.componentWillReceiveProps(nextProps);
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.shouldComponentUpdate) {
            return vnode.shouldComponentUpdate(nextProps, nextState);
        }

        return true;
    },
    componentWillUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.componentWillUpdate) {
            vnode.componentWillUpdate(nextProps, nextState);
        }
    },
    componentDidUpdate: function(nextProps, nextState) {
        var vnode = this._instance;
        if (vnode.componentDidUpdate) {
            vnode.componentDidUpdate(nextProps, nextState);
        }
    }
});

module.exports = NeactCompositeComponent;