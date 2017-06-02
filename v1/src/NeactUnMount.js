'use strict';

var is = require('./is');
var util = require('./util');
var DOMApi = require('./dom');

function unmount(inst, parentDom) {
    if (inst._isCompositeComponent) {
        unmountComponent(inst, parentDom);
    } else if (inst._isDOMComponent) {
        unmountElement(inst, parentDom);
    } else if (inst._isDOMTextComponent || inst._isEmptyComponent) {
        unmountText(inst, parentDom);
    }
}

function unmountComponent(inst, parentDom) {
    var children = inst.children;
    var instance = inst._instance;
    var dom = inst.getDOM();

    if (!inst._unmounted) {
        instance.componentWillUnmount && instance.componentWillUnmount();
        instance._unmounted = inst._unmounted = true;

        //detachRef(inst);
        inst._detachRef();

        if (children) {
            unmount(children, null);
        }
    }

    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountElement(inst, parentDom) {
    var dom = inst.dom;
    var props = inst.props;

    if (!inst._unmounted) {
        inst.componentWillUnmount();
        inst._unmounted = true;

        //detachRef(inst);
        inst._detachRef();
    }

    unmountChildren(inst.children);

    if (parentDom) {
        DOMApi.removeChild(parentDom, dom);
    }
}

function unmountText(inst, parentDom) {
    if (parentDom) {
        DOMApi.removeChild(parentDom, inst.dom);
    }
}

function unmountChildren(children) {
    if (is.array(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!is.invalid(child) && is.object(child)) {
                unmount(child, null);
            }
        }
    } else if (is.object(children)) {
        unmount(children, null);
    }
}

function unmountComponentAtNode(dom) {
    if (dom.__NeactInstance) {
        unmount(dom.__NeactInstance, dom);
        delete dom.__NeactInstance;
    }
}

module.exports = {
    unmountComponentAtNode: unmountComponentAtNode,
    unmount: function(inst) {
        unmount(inst, inst.getParentDOM());
    }
};