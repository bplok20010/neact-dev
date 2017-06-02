/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */
var util = require('./util');
var is = require('./is');
//var NeactElement = require('./NeactElement');

function NeactCompositeComponent(element) {
    this.key = element.key;
    this.type = element.type;
    this.props = element.props;
    this._currentElement = element;
    this._context = null;
    var instance = this._getInstance();
    this._instance = instance;
    //this.elm = instance;
    //this.dom = instance;
    //Component.call(this, element);
    //this.elm = null;
    this.dom = null;
    this._instance._instanceCompositeComponent = this;
}

util.assign(NeactCompositeComponent.prototype, {
    _isComponent: true,
    _unmounted: true,
    _isCompositeComponent: true,
    _nextState: null,
    _getInstance: function() {
        var type = this.type;
        var props = this._currentElement.props;
        return new type(props);
    },
    getDOM: function() {
        var inst = this,
            dom = inst.dom;
        //(is.array(inst.children) ? inst.children[0] : inst.children)
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
        var childs = this._instance.render();
        if (is.array(childs)) {
            throw new TypeError('a valid VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        //if (is.primitive(childs)) {
        //    childs = NeactElement.createTextElement(childs);
        //} else if (is.invalid(childs)) {
        //    childs = NeactElement.createVoidElement();
        //}

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