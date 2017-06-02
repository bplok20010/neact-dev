'use strict';

var is = require('./is');
var util = require('./util');
var dom = require('./dom');
var instantiateComponent = require('./instantiateComponent');

function unmountComponentAtNode(dom) {}

function createElm(vnode, parent, insertedVnodeQueue) {
    var i, elm = vnode.elm,
        children = vnode.children;

    if (is.compositeComponent(vnode)) {
        insertedVnodeQueue.push(vnode);
        if (!is.invalid(children)) {
            createElm(children, parent, insertedVnodeQueue);
        }
    } else {
        if (parent) {
            dom.appendChild(parent, elm);
        }

        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                if (is.invalid(children[i])) continue;
                createElm(children[i], elm, insertedVnodeQueue);
            }
        } else if (!is.invalid(children)) {
            createElm(children, elm, insertedVnodeQueue);
        }


    }
    return vnode.getDOM();
}

function render(vnode, parentDOM, parentVNodeInstance) {
    var i, elm;
    var insertedVnodeQueue = [];

    if (is.invalid(vnode)) {
        throw new TypeError('vnode invalid');
    }

    vnode = instantiateComponent(vnode, parentVNodeInstance);

    elm = createElm(vnode, null, insertedVnodeQueue);

    if (parentDOM) {
        dom.insertBefore(parentDOM, elm);
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        var instance = insertedVnodeQueue[i]._instance;
        if (instance.componentDidMount) {
            instance.componentDidMount();
        }
    }

    return vnode;
}

module.exports = {
    createElm: createElm,
    render: render
};