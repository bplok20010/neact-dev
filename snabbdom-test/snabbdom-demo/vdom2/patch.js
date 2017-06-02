var is = require('./is');
var util = require('./util');
var api = require('./dom');
var parseVNode = require('./parseVNode');
var Render = require('./Render');
var vElement = require('./ReactElement');

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (is.def(key)) map[key] = i;
    }
    return map;
}

function updateChildren(parentVnode, oldCh, newCh, insertedVnodeQueue) {

    if (is.array(newCh)) {
        newCh = util.map(newCh, function(vnode) {
            if (is.primitive(vnode)) {
                var _text = vnode;
                vnode = vElement.createElement(null);
                vnode.text = _text;
            }
            return vnode
        });
    }

    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    var log = oldCh.length > 5;

    var parentElm = parentVnode.getParentDOM();

    log && console.log(oldCh.length, newCh.length, 'start');

    //log && console.log(oldCh, newCh, '++++');

    var newChilds = Array(newCh.length);
    //开始循环
    //当新旧任意一个检测完后就退出
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        log && console.log(newStartIdx, newEndIdx, 'index...')
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
            //log && console.log(oldStartVnode, oldEndVnode, oldStartVnode.getDOM(), oldEndVnode.getDOM(), 'error333??');
            //if(!is.vcomponent(oldEndVnode)) 
            api.insertBefore(parentElm, oldStartVnode.getDOM(), api.nextSibling(oldEndVnode.getDOM()));
            newChilds[newEndIdx] = oldStartVnode;
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (is.sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left

            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            //log && console.log(oldEndVnode, oldStartVnode, oldEndVnode.getDOM(), oldStartVnode.getDOM(), 'error222??');
            api.insertBefore(parentElm, oldEndVnode.getDOM(), oldStartVnode.getDOM());
            newChilds[newStartIdx] = oldEndVnode;
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            log && console.log(oldCh, oldStartIdx, oldEndIdx, oldKeyToIdx, 'key??')
            if (is.undef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (is.undef(idxInOld) || is.undef(oldCh[idxInOld])) { // New element
                var vnode = parseVNode(newCh[newStartIdx], parentVnode);
                var elm = Render.createElm(vnode, null, insertedVnodeQueue);
                api.insertBefore(parentElm, elm, oldStartVnode.getDOM());
                //api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.getDOM());
                log && console.log('new...');
                //newChilds[newStartIdx] = elmToMove;
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
            console.log(oldCh, oldStartIdx, oldEndIdx, 'error??')
        }
    }

    parentVnode.children = newChilds;

    if (oldStartIdx > oldEndIdx) {
        before = is.undef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        //console.log(newStartIdx, newEndIdx, 'add??');
        for (; newStartIdx <= newEndIdx; newStartIdx++) {
            log && console.log(newStartIdx, 'add??')
            var vnode = parseVNode(newCh[newStartIdx], parentVnode);
            var elm = Render.createElm(vnode, null, insertedVnodeQueue);

            api.insertBefore(parentElm, elm, before);

            newChilds[newStartIdx] = vnode;
        }

        // addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }


    log && console.log(newChilds, newStartIdx, newEndIdx, 'after...');
}

function addVnodes(vnode, parentVnode) {
    vnode = parseVNode(vnode, parentVnode);

    createElm(vnode, parentVnode.getDOM(), insertedVnodeQueue);

    return vnode;
}

function removeVnodes(vnode) {
    var node = null;
    var pdom = vnode.getParentDOM();
    api.removeChild(pdom, vnode.getDOM());
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
    //shouldUpdate...
    if (!vnode) {
        vnode = oldVnode.render();
    }

    if (is.primitive(vnode)) {
        var _text = vnode;
        vnode = vElement.createElement(null);
        vnode.text = _text;
    }

    var parentElm = oldVnode.getParentDOM(),
        elm = oldVnode.getDOM(),
        oldCh = getVnodeChildren(oldVnode),
        ch = getVnodeChildren(oldVnode, vnode);


    // if (ch) {
    //    ch = ch.props.children;
    //}
    //console.log(oldVnode, vnode);
    //return;
    if (oldVnode === vnode) return;

    if (!is.sameVnode(oldVnode, vnode)) {
        console.log(oldVnode, vnode, '!same');
        elm = createElm(parseVNode(vnode, oldVnode.parentNode), null, insertedVnodeQueue);
        api.insertBefore(parentElm, elm, oldVnode.getDOM());
        removeVnodes(oldVnode);
        return;
    }

    //shouldUpdate

    //优先级 vnode.text > vnode.children
    if (is.undef(vnode.text)) {
        if (is.def(oldCh) && is.def(ch)) {
            oldCh = is.array(oldCh) ? oldCh : [oldCh];
            ch = is.array(ch) ? ch : [ch];
            //如果新旧vdom都存在子节点则调用updateChildren进行
            if (oldCh !== ch) updateChildren(oldVnode, oldCh, util.flatten(ch), insertedVnodeQueue);
        } else if (is.def(ch)) { //old vdom无children时
            //清空old vdom的文本内容
            //if (isDef(oldVnode.text)) api.setTextContent(elm, '');
            //把new vdom的children直接插入到elm
            oldVnode.children = addVnodes(ch, oldVnode, insertedVnodeQueue);
        } else if (is.def(oldCh)) {
            //new vdom不存在children时
            //删除vdom.elm下所有节点 并调用相应的hook
            console.log(oldVnode, vnode, '??');
            //removeVnodes(oldVnode);
            //oldVnode.children = null;
        } else if (is.def(oldVnode.text)) {
            //old vdom还存在text 也清空
            api.setTextContent(elm, '');
        }
    } else if (oldVnode.text !== vnode.text) {
        api.setTextContent(oldVnode.getDOM(), vnode.text);
    }
    //if (is.def(hook) && is.def(i = hook.postpatch)) {
    //    i(oldVnode, vnode);
    //}
}


module.exports = {
    patchVnode: patchVnode,
    updateChildren: updateChildren
};