var is = require('./is');
var util = require('./util');
var api = require('./dom');
var parseVNode = require('./instantiateComponent');
var vElement = require('./vnode');
var mount = require('./mount').mount;
var unmount = require('./unmount').unmount;

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
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

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
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
            var vnode = mount(newCh[newStartIdx], parentVnode, parentElm, before);
            newChilds[newStartIdx] = vnode;
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

    var willReceive = false;

    if (prevElement !== nextElement) {
        willReceive = true;
    }

    if (willReceive) {
        prevComponent.componentWillReceiveProps(nextProps);
    }

    var nextState = prevComponent._instance.state;
    var shouldUpdate = true;

    shouldUpdate = prevComponent.shouldComponentUpdate(nextProps, nextState);

    if (shouldUpdate === false) return;

    prevComponent.componentWillUpdate(nextProps, nextState);

    var lastChildren = prevComponent.children;

    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    var nextChildren = prevComponent.render();

    patchVnode(lastChildren, nextChildren);

    prevComponent.componentDidUpdate(nextProps, nextState);

}

function patchDOMComponent(prevComponent, nextElement) {
    var dom = prevComponent.getDOM();
    var lastChildren = prevComponent.children;
    var prevProps = prevComponent.props;
    var nextProps = nextElement.props;
    var parentDOM = dom;

    if (prevProps !== nextProps) {
        prevComponent.patchProps(prevProps, nextProps, dom);
    }

    prevComponent.props = nextElement.props;
    prevComponent._currentElement = nextElement;

    var nextChildren = prevComponent.render();

    //use invalid?
    if (is.def(lastChildren) && is.def(nextChildren)) {
        if (lastChildren !== nextChildren)
            updateChildren(prevComponent, util.toArray(lastChildren), util.toArray(nextChildren));
    } else if (is.def(nextChildren)) {
        nextChildren = util.toArray(nextChildren);
        var news = [];
        for (i = 0; i < nextChildren.length; i++) {
            var child = nextChildren[i];
            var vnode = mount(child, prevComponent, parentDOM, null);
            news.push(vnode);
        }
        prevComponent.children = news;
    } else if (is.def(lastChildren)) {
        unmountChildren(lastChildren);
        prevComponent.children = null;
    }
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

function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    if (is.invalid(vnode)) {
        return;
    }
    if (!is.component(oldVnode)) {
        return;
    }

    var i, hook;
    var parentElm = oldVnode.getParentDOM(),
        elm = oldVnode.getDOM();

    if (!is.sameVnode(oldVnode, vnode)) {
        var parentVnode = oldVnode.parentNode;
        var inst = mount(vnode, parentVnode, parentElm, elm);
        unmount(oldVnode);
        if (parentVnode) { // && is.compositeComponent(parentVnode)
            parentVnode.children = inst;
        }
        return;
    }

    if (is.compositeComponent(oldVnode)) {
        patchComponent(oldVnode, vnode);
    } else if (is.domComponent(oldVnode)) {
        patchDOMComponent(oldVnode, vnode);
    } else if (is.domTextComponent(oldVnode)) {
        patchDOMTextComponent(oldVnode, vnode);
    }
}


module.exports = {
    patchVnode: patchVnode,
    updateChildren: updateChildren
};