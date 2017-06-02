'use strict';

var is = require('./is');
var util = require('./util');
var DOMApi = require('./dom');

function unmount(inst, parentDom, isRecycling) {
    if (inst._isCompositeComponent) {
        unmountComponent(inst, parentDom, isRecycling);
    } else if (inst._isDOMComponent) {
        unmountElement(inst, parentDom, isRecycling);
    } else if (inst._isDOMTextComponent || inst._isEmptyComponent) {
        unmountText(inst, parentDom);
    }
}

function unmountComponent(inst, parentDom, isRecycling) {
    var children = inst.children;
    var instance = inst._instance;
    var dom = inst.getDOM();

    if (!isRecycling) {
        if (!inst._unmounted) {
            instance.componentWillUnmount && instance.componentWillUnmount();
            instance._unmounted = inst._unmounted = true;

            if (children) {
                unmount(children, null, isRecycling);
            }
        }
    }
    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountElement(inst, parentDom, isRecycling) {
    var dom = inst.dom;
    var props = inst.props;

    if (!isRecycling) {
        unmountChildren(inst.children, isRecycling)
    }

    for (var name in props) {
        // do not add a hasOwnProperty check here, it affects performance
        if (is.attrEvent(name)) {
            inst.patchEvent(name, props[name], null, dom);
        }
    }

    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountText(inst, parentDom) {
    if (parentDom) {
        DOMApi.removeChild(parentDom, inst.dom);
    }
}

function unmountChildren(children, isRecycling) {
    if (is.array(children)) {
        for (let i = 0; i < children.length; i++) {
            var child = children[i];

            if (!is.invalid(child) && is.object(child)) {
                unmount(child, null, isRecycling);
            }
        }
    } else if (is.object(children)) {
        unmount(children, null, isRecycling);
    }
}

module.exports = {
    unmountElement: unmountElement,
    unmountComponent: unmountComponent,
    unmountText: unmountText,
    unmount: function(inst) {
        unmount(inst, inst.getParentDOM());
    }
};