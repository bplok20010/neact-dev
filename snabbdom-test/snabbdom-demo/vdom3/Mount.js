'use strict';

var is = require('./is');
var util = require('./util');
var api = require('./dom');
var instantiateComponent = require('./instantiateComponent');

function unmountComponentAtNode(dom) {}

function createElm(vnode, parent, insertedVnodeQueue) {

    if (is.undef(vnode)) return document.createDocumentFragment();

    var i, data = vnode.props;
    var elm = vnode.elm,
        instance = vnode._instance,
        children = vnode.children;

    if (is.compositeComponent(vnode)) {
        insertedVnodeQueue.push(vnode);
        createElm(children, parent, insertedVnodeQueue);
    } else {
        if (parent) {
            api.appendChild(parent, elm);
        }
        if (is.def(children)) {
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    createElm(children[i], elm, insertedVnodeQueue);
                }
            } else {
                createElm(children, elm, insertedVnodeQueue);
            }
        }
    }

    return vnode.getDOM();
}

function render(vnode, parent) {
    var i, elm;
    var insertedVnodeQueue = [];

    vnode = instantiateComponent(vnode);

    if (is.undef(vnode)) return null;

    elm = createElm(vnode, null, insertedVnodeQueue);

    if (parent) {
        api.insertBefore(parent, elm);
    }
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        var $vnode = insertedVnodeQueue[i]._instance;
        if ($vnode.componentDidMount) {
            $vnode.componentDidMount();
        }
    }

    return vnode;
}

var Mount = {
    render: render
};

module.exports = Mount;