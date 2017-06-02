'use strict';
var is = require('./is');
var util = require('./util');
var NeactElement = require('./NeactElement');
var NeactClass = require('./NeactClass');
var NeactMount = require('./NeactMount');
var NeactUnMount = require('./NeactUnMount');
var NeactComponent = require('./NeactComponent');
var NeactPureComponent = require('./NeactPureComponent');
var patch = require('./patch');
var shallowEqual = require('./shallowEqual');



var Neact = {
    createElement: NeactElement.createElement,
    createTextElement: NeactElement.createTextElement,
    createFactory: NeactElement.createFactory,
    isValidElement: NeactElement.isValidElement,
    createClass: NeactClass.createClass,
    Component: NeactComponent,
    PureComponent: NeactPureComponent,
    shallowEqual: shallowEqual,
    util: util,
    render: function(vnode, parentDOM) {
        if (!is.vnode(vnode)) return null;
        if (!parentDOM) return null;

        var lastInst = parentDOM.__NeactInstance;

        if (!lastInst) {
            var inst = parentDOM.__NeactInstance = NeactMount.mount(vnode, null, parentDOM, null);
            return inst._instance;
        }

        lastInst = parentDOM.__NeactInstance = patch.patchVnode(lastInst, vnode);

        return lastInst._instance;
    },
    findDOMNode: function(component) {
        return component._instanceCompositeComponent.getDOM();
    },
    unmountComponentAtNode: NeactUnMount.unmountComponentAtNode
};

module.exports = Neact;