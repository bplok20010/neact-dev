var is = require('./is');

function isUndef(s) { return s === undefined; }

function isDef(s) { return s !== undefined; }

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {},
        key;
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) map[key] = i;
    }
    return map;
}

function createComponent(vnode) {
    //if( typeof vnode.sel == 'function' )
    // console.log(vnode.sel.$name, vnode, 'createComponent')
    if (typeof vnode.sel == 'function' && !vnode.$vnode) {
        vnode.$vnode = new vnode.sel(vnode);
        var childs = vnode.$vnode.render();
        vnode.children = childs;
    }
    return vnode;
}

function createElm(vnode, insertedVnodeQueue) {
    createComponent(vnode);
    if (vnode.$vnode) {
        // vnode.$vnode = new vnode.sel(vnode);
        //var childs = vnode.$vnode.render();
        console.log(vnode.$vnode.name, vnode);
        var elm = createElm(vnode.children, insertedVnodeQueue);
        vnode.elm = elm;
        //vnode.children = is.array(childs) ? childs : [childs];
        //console.log(childs, 'af');//
        return elm;
    }

    var i, data = vnode.data;
    if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) {
            i(vnode);
            data = vnode.data;
        }
    }
    var elm, children = vnode.children,
        sel = vnode.sel;
    if (isDef(sel)) {
        // Parse selector
        if (vnode.$vnode) {
            elm = vnode.elm;
        } else {
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) :
                api.createElement(tag);

            if (hash < dot) elm.id = sel.slice(hash + 1, dot);
            if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
        }
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
            }
        } else if (is.primitive(vnode.text)) {
            api.appendChild(elm, api.createTextNode(vnode.text));
        }
        for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
            if (i.create) i.create(emptyNode, vnode);
            if (i.insert) insertedVnodeQueue.push(vnode);
        }
    } else {
        elm = vnode.elm = api.createTextNode(vnode.text);
    }
    return vnode.elm;
}

function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    oldCh.map((d) => createComponent(d));
    newCh.map((d) => createComponent(d));

    // console.log(oldCh, newCh, 'updateChildren')

    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    //开始循环
    //当新旧任意一个检测完后就退出
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) { //对于undefind的子节点字节跳过
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) { //对于undefind的子节点字节跳过
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) { //是否相同KEY
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
            //if(!is.vcomponent(oldEndVnode)) 
            api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            //if(!is.vcomponent(oldEndVnode)) 
            api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (isUndef(idxInOld) || isUndef(oldCh[idxInOld])) { // New element
                //if (!is.vcomponent(newStartVnode)) 
                api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                oldCh[idxInOld] = undefined;
                api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx > oldEndIdx) {
        before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
}

function patchVnode(oldVnode, vnode, insertedVnodeQueue) {

    createComponent(vnode);
    createComponent(oldVnode);

    var i, hook;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
        i(oldVnode, vnode);
    }


    if (vnode.children) {
        vnode.children = is.array(vnode.children) ? vnode.children : [vnode.children];
    }
    if (oldVnode.children) {
        oldVnode.children = is.array(oldVnode.children) ? oldVnode.children : [oldVnode.children];
    }

    var elm = vnode.elm = oldVnode.elm,
        oldCh = oldVnode.children,
        ch = vnode.children;
    //console.log(oldCh, ch, 'patchVnode', oldVnode, vnode); 
    if (oldVnode === vnode) return;
    if (!sameVnode(oldVnode, vnode)) {
        var parentElm = api.parentNode(oldVnode.elm);
        elm = createElm(vnode, insertedVnodeQueue, parentElm);
        api.insertBefore(parentElm, elm, oldVnode.elm);
        removeVnodes(parentElm, [oldVnode], 0, 0);
        return;
    }
    if (isDef(vnode.data)) {
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
        i = vnode.data.hook;
        if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    //优先级 vnode.text > vnode.children
    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            //如果新旧vdom都存在子节点则调用updateChildren进行
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
        } else if (isDef(ch)) { //old vdom无children时
            //清空old vdom的文本内容
            if (isDef(oldVnode.text)) api.setTextContent(elm, '');
            //把new vdom的children直接插入到elm
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
            //new vdom不存在children时
            //删除vdom.elm下所有节点 并调用相应的hook
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
            //old vdom还存在text 也清空
            api.setTextContent(elm, '');
        }
    } else if (oldVnode.text !== vnode.text) {
        api.setTextContent(elm, vnode.text);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
        i(oldVnode, vnode);
    }
}

function patch(oldVnode, vnode) {
    var i, elm, parent;
    //var insertedVnodeQueue = [];
    //for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef(oldVnode.sel)) {
        oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
        elm = oldVnode.elm;
        parent = api.parentNode(elm);

        createElm(vnode, insertedVnodeQueue);

        if (parent !== null) {
            api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
            removeVnodes(parent, [oldVnode], 0, 0);
        }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();


    return vnode;
}

module.exports = patch;