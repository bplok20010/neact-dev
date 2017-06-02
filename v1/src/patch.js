'use strict';
var is = require('./is');
var util = require('./util');
var api = require('./dom');
var mount = require('./NeactMount').mount;
var unmount = require('./NeactUnMount').unmount;
var createTextElement = require('./NeactElement').createTextElement;
var createVoidElement = require('./NeactElement').createVoidElement;
var shallowEqual = require('./shallowEqual');

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        if (is.invalid(children[i])) continue;
        key = children[i].key;
        if (is.def(key)) map[key] = i;
    }
    return map;
}

function unmountChildren(children, isRecycling) {
    if (is.component(children)) {
        unmount(children, isRecycling);
    } else if (is.array(children)) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (!is.invalid(child)) {
                unmount(child, isRecycling);
            }
        }
    }
}

function updateChildren(parentVnode, oldCh, newCh) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var parentElm = parentVnode.getDOM();

    var newChilds = Array(newCh.length);

    function getNextNewChild() {
        while (!newStartVnode && newStartIdx <= newEndIdx) {
            newStartVnode = newCh[++newStartIdx];
            newChilds[newStartIdx] = null;
        }

        return newStartVnode;
    }

    function getPrevNewChild() {
        while (!newEndVnode && newEndIdx >= newStartIdx) {
            newEndVnode = newCh[--newEndIdx];
            newChilds[newEndIdx] = null;
        }

        return newEndVnode;
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        //if (1) {

        if (is.invalid(newStartVnode)) {
            newStartVnode = getNextNewChild();
        }

        if (is.invalid(newEndVnode)) {
            newEndVnode = getPrevNewChild();
        }

        if (is.invalid(newStartVnode) || is.invalid(newEndVnode)) {
            break;
        }

        if (is.primitive(newStartVnode)) {
            newStartVnode = createTextElement(newStartVnode);
            newCh[newStartIdx] = newStartVnode;
        }

        if (is.primitive(newEndVnode)) {
            newEndVnode = createTextElement(newEndVnode);
            newCh[newEndIdx] = newEndVnode;
        }

        //}

        if (is.undef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (is.undef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (is.sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode);
            newChilds[newStartIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (is.sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode);
            newChilds[newEndIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode);
            api.insertBefore(parentElm, oldStartVnode.getDOM(), api.nextSibling(oldEndVnode.getDOM()));
            newChilds[newEndIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode);
            api.insertBefore(parentElm, oldEndVnode.getDOM(), oldStartVnode.getDOM());
            newChilds[newStartIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (is.undef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (is.undef(idxInOld) || is.undef(oldCh[idxInOld])) { // New element
                var vnode = mount(newCh[newStartIdx], parentVnode, parentElm, oldStartVnode.getDOM());
                newChilds[newStartIdx] = vnode;
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode);
                oldCh[idxInOld] = undefined;
                api.insertBefore(parentElm, elmToMove.getDOM(), oldStartVnode.getDOM());
                newChilds[newStartIdx] = elmToMove;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) { // New element
        before = is.undef(newChilds[newEndIdx + 1]) ? null : newChilds[newEndIdx + 1].getDOM();
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            if (!is.invalid(newCh[newStartIdx])) {
                if (is.primitive(newCh[newStartIdx])) {
                    newCh[newStartIdx] = createTextElement(newCh[newStartIdx]);
                }
                var vnode = mount(newCh[newStartIdx], parentVnode, parentElm, before);
                newChilds[newStartIdx] = vnode;
            } else {
                newChilds[newStartIdx] = null;
            }
        }
    } else if (newStartIdx > newEndIdx) { // Remove element
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {
            var vnode = oldCh[oldStartIdx];
            if (vnode) {
                unmount(vnode);
            }
        }
    }

    parentVnode.children = newChilds;
}

function patchComponent(prevComponent, nextElement) {
    var prevElement = prevComponent._currentElement;
    var nextElement = nextElement;

    var prevProps = prevElement.props;
    var nextProps = nextElement.props;

    var prevState = prevComponent._instance.state;
    var nextState = prevComponent._nextState || prevState;

    var isPureNeactComponent = prevComponent._instance.isPureNeactComponent;

    var willReceive = false;

    if (prevElement !== nextElement) {
        willReceive = true;
    }

    if (willReceive) {
        prevComponent.componentWillReceiveProps(nextProps);
    }

    var shouldUpdate = true;

    prevComponent._nextState = null;

    if (!isPureNeactComponent) {
        shouldUpdate = prevComponent.shouldComponentUpdate(nextProps, nextState);
    } else {
        shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(prevState, nextState);
    }

    if (shouldUpdate === false) return;

    //onBeforeComponentUpdate
    var refsChanged = prevComponent.shouldUpdateRefs(nextElement);

    if (refsChanged) {
        prevComponent._detachRef();
    }

    prevComponent.componentWillUpdate(nextProps, nextState);

    var lastChildren = prevComponent.children;

    prevComponent._instance.state = nextState;
    prevComponent._instance.props = nextProps;
    prevComponent.key = nextElement.key;
    prevComponent.type = nextElement.type;
    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    if (refsChanged && nextElement && nextElement.ref != null) {
        prevComponent._attachRef();
    }

    var nextChildren = prevComponent.render();

    patchVnode(lastChildren, nextChildren);

    prevComponent.componentDidUpdate(prevProps, prevState);

}

function patchDOMComponent(prevComponent, nextElement) {
    var dom = prevComponent.getDOM();
    var lastChildren = prevComponent.children;
    var prevProps = prevComponent.props;
    var nextProps = nextElement.props;
    var parentDOM = dom;

    //onBeforeComponentUpdate
    var refsChanged = prevComponent.shouldUpdateRefs(nextElement);

    if (refsChanged) {
        prevComponent._detachRef();
    }

    prevComponent.componentWillUpdate(nextProps, null);

    prevComponent.key = nextElement.key;
    prevComponent.type = nextElement.type;
    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    if (refsChanged && nextElement && nextElement.ref != null) {
        prevComponent._attachRef();
    }

    var nextChildren = prevComponent.render();

    //use invalid?
    if (is.def(lastChildren) && is.def(nextChildren)) {
        if (lastChildren !== nextChildren) {
            updateChildren(prevComponent, util.toArray(lastChildren), util.toArray(nextChildren));
        }
    } else if (is.def(nextChildren)) {
        nextChildren = util.toArray(nextChildren);
        var news = [];
        for (var i = 0; i < nextChildren.length; i++) {
            var child = nextChildren[i];
            //if (is.invalid(child)) continue;
            if (is.primitive(child)) {
                child = createTextElement(child);
            }
            var vnode = mount(child, prevComponent, parentDOM, null);
            news.push(vnode);
        }
        prevComponent.children = news;
    } else if (is.def(lastChildren)) {
        unmountChildren(lastChildren);
        prevComponent.children = null;
    }

    prevComponent.componentDidUpdate(prevProps, null);
}

function patchDOMTextComponent(prevComponent, nextElement) {
    var dom = prevComponent.getDOM();
    if (prevComponent.text !== nextElement.props.text) {
        api.setTextContent(dom, nextElement.props.text);
        prevComponent.props = nextElement.props;
        prevComponent.text = nextElement.props.text;
        prevComponent._currentElement = nextElement;
    }
}

function patchVnode(oldVnode, vnode) {
    if (is.invalid(vnode)) {
        return oldVnode;
    }
    if (!is.component(oldVnode)) {
        return null;
    }

    if (!is.sameVnode(oldVnode, vnode)) {
        var parentElm = oldVnode.getParentDOM(),
            elm = oldVnode.getDOM(),
            parentVnode = oldVnode.parentNode,
            nextElm = elm.nextSibling;
        unmount(oldVnode);
        var inst = mount(vnode, parentVnode, parentElm, nextElm);
        if (parentVnode) {
            parentVnode.children = inst;
        }
        return inst;
    }

    if (is.compositeComponent(oldVnode)) {
        patchComponent(oldVnode, vnode);
    } else if (is.domComponent(oldVnode)) {
        patchDOMComponent(oldVnode, vnode);
    } else if (is.domTextComponent(oldVnode)) {
        patchDOMTextComponent(oldVnode, vnode);
    }

    return oldVnode;
}


module.exports = {
    patchComponent: patchComponent,
    patchVnode: patchVnode,
    updateChildren: updateChildren
};