'use strict';

var is = require('./is');
var util = require('./util');
var DOMApi = require('./dom');
var instantiateComponent = require('./instantiateNeactComponent');

function unmountComponentAtNode(dom) {}

function mountInstance(inst, parentDOM, insertedVnodeQueue) {
    var i, dom = inst.dom,
        children = inst.children;

    if (is.compositeComponent(inst)) {
        insertedVnodeQueue.push(inst);
        if (!is.invalid(children)) {
            mountInstance(children, parentDOM, insertedVnodeQueue);
        }
    } else {
        if (parentDOM) {
            DOMApi.appendChild(parentDOM, dom);
        }
        //设置元素属性时，元素必须append到document中，不然有些参数会无效 eg.ie8下 img.width img.height 
        if (is.domComponent(inst)) {
            inst.componentDidMount();
            //inst.patchProps(null, inst.props, dom, inst._currentElement.isSvg);
        }

        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                if (!is.invalid(children[i])) {
                    mountInstance(children[i], dom, insertedVnodeQueue);
                }
            }
        } else if (!is.invalid(children)) {
            mountInstance(children, dom, insertedVnodeQueue);
        }

    }

    return inst;
}

function mount(vnode, parentInst, parentDOM, before) {
    var i, dom;
    var insertedVnodeQueue = [];
    var inst = mountInstance(instantiateComponent(vnode, parentInst), parentDOM, insertedVnodeQueue);

    dom = inst.getDOM();

    //防止classComponent 返回null 
    if (parentDOM && dom) { //? && dom
        DOMApi.insertBefore(parentDOM, dom, before);
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].componentDidMount();
    }

    return inst;
}

module.exports = {
    mount: mount,
    render: function(vnode, parentDOM) {
        if (!is.vnode(vnode)) return null;
        return mount(vnode, null, parentDOM, null)._instance;
    }
};