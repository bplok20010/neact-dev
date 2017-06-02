var is = require('./is');
var util = require('./util');
var api = require('./dom');
var parseVNode = require('./instantiateComponent');
var vElement = require('./vnode');
var mount = require('./mount');

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (is.def(key)) map[key] = i;
    }
    return map;
}

function removeVnode(vnode, remove) {
    var i, children = vnode.children;

    if (is.compositeComponent(vnode)) {
        var instance = vnode._instance;
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
    }

    if (is.def(children)) {
        children = is.array(children) ? children : [children];
        for (i = 0; i < children.length; i++) {
            removeVnode(children[i]);
        }
    }

    if (remove) {
        var dom = vnode.getDOM();
        api.removeChild(dom.parentNode, dom);
    }
}

function removeVnodes(children) {
    if (is.def) {
        children = is.array(children) ? children : [children];
    }
    for (var i = 0; i < children.length; i++) {
        removeVnode(children[i], true);
    }
}

function updateChildren(parentVnode, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var parentElm = parentVnode.getParentDOM();

    var newChilds = Array(newCh.length);
    //开始循环
    //当新旧任意一个检测完后就退出
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (is.undef(oldStartVnode)) { //对于undefind的子节点字节跳过
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (is.undef(oldEndVnode)) { //对于undefind的子节点字节跳过
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (is.sameVnode(oldStartVnode, newStartVnode)) { //是否相同KEY
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
            newChilds[newStartIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (is.sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
            newChilds[newEndIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
            api.insertBefore(parentElm, oldStartVnode.getDOM(), api.nextSibling(oldEndVnode.getDOM()));
            newChilds[newEndIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left

            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            api.insertBefore(parentElm, oldEndVnode.getDOM(), oldStartVnode.getDOM());
            newChilds[newStartIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (is.undef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

            idxInOld = oldKeyToIdx[newStartVnode.key];

            if (is.undef(idxInOld) || is.undef(oldCh[idxInOld])) { // New element
                var vnode = parseVNode(newCh[newStartIdx], parentVnode);
                var elm = mount.createElm(vnode, null, insertedVnodeQueue);
                api.insertBefore(parentElm, elm, oldStartVnode.getDOM());
                newChilds[newStartIdx] = vnode;
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                oldCh[idxInOld] = undefined;
                api.insertBefore(parentElm, elmToMove.getDOM(), oldStartVnode.getDOM());
                newChilds[newStartIdx] = elmToMove;
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    parentVnode.children = newChilds;

    if (oldStartIdx > oldEndIdx) {
        before = is.undef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            var vnode = parseVNode(newCh[newStartIdx], parentVnode);
            var elm = mount.createElm(vnode, null, insertedVnodeQueue);
            api.insertBefore(parentElm, elm, before);
            newChilds[newStartIdx] = vnode;
        }
    } else if (newStartIdx > newEndIdx) {
        for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {
            var vnode = oldCh[oldStartIdx];
            if (vnode)
                removeVnode(vnode, true);
        }
    }
}

function addVnodes(vnode, parentVnode) {
    vnode = parseVNode(vnode, parentVnode);

    createElm(vnode, parentVnode.getDOM(), insertedVnodeQueue);

    return vnode;
}


function getVnodeChildren(vnodeInstance, vnode) {
    if (arguments.length == 1) {
        return vnodeInstance.children;
    }
    //vnode结构体
    vnodeInstance.setProps(vnode.props);
    return vnodeInstance.render();
    //return vnode.props.children;
}

function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    var shouldUpdate = true;

    if (is.compositeComponent(oldVnode)) {
        var instance = oldVnode._instance;
        if (instance.shouldComponentUpdate) {
            shouldUpdate = instance.shouldComponentUpdate();
        }
    }

    if (shouldUpdate === false) return;

    if (!vnode) {
        return;
        //vnode = oldVnode.render();
    }

    //if (is.primitive(vnode)) {
    //    var _text = vnode;
    //    vnode = vElement.createElement(null);
    //    vnode.text = _text;
    //}

    var parentElm = oldVnode.getParentDOM(),
        elm = oldVnode.getDOM(),
        oldCh = getVnodeChildren(oldVnode),
        ch = getVnodeChildren(oldVnode, vnode);

    // if (ch) {
    //    ch = ch.props.children;
    //}
    //console.log(oldCh, ch, 'next updateChildren');

    //if (oldVnode === vnode) return;

    if (!is.sameVnode(oldVnode, vnode)) {
        console.log(oldVnode, vnode, '!same');
        elm = createElm(parseVNode(vnode, oldVnode.parentNode), null, insertedVnodeQueue);
        api.insertBefore(parentElm, elm, oldVnode.getDOM());
        removeVnode(oldVnode, true);
        return;
    }

    //shouldUpdate

    //优先级 vnode.text > vnode.children
    if (!is.textElement(vnode)) {
        console.log(oldCh, ch, 'xx');
        if (is.def(oldCh) && is.def(ch)) {
            oldCh = is.array(oldCh) ? oldCh : [oldCh];
            ch = is.array(ch) ? ch : [ch];
            //如果新旧vdom都存在子节点则调用updateChildren进行
            if (oldCh !== ch) updateChildren(oldVnode, oldCh, util.flatten(ch), insertedVnodeQueue);
        } else if (is.def(ch)) { //old vdom无children时
            //清空old vdom的文本内容
            //if (isDef(oldVnode.text)) api.setTextContent(elm, '');
            //把new vdom的children直接插入到elm
            ch = is.array(ch) ? ch : [ch];
            var news = [];
            for (i = 0; i < ch.length; i++) {
                var _vnode = parseVNode(ch[i], oldVnode);
                var elm = mount.createElm(_vnode, null, insertedVnodeQueue);
                api.insertBefore(parentElm, elm);
                //newChilds[newStartIdx] = vnode;
                news.push(news);
            }
            oldVnode.children = news;
        } else if (is.def(oldCh)) {
            //new vdom不存在children时
            //删除vdom.elm下所有节点 并调用相应的hook
            removeVnodes(oldVnode.children);
            oldVnode.children = null;
        } else if (is.def(oldVnode.text)) {
            //old vdom还存在text 也清空
            api.setTextContent(elm, '');
        }
    } else if (oldVnode.text !== vnode.props.text) {
        api.setTextContent(oldVnode.getDOM(), vnode.text);
        oldVnode.text = vnode.props.text;
    }
}


module.exports = {
    patchVnode: patchVnode,
    updateChildren: updateChildren
};