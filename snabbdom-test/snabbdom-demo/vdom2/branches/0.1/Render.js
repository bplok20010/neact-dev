var api = require('./dom');
var parseVNode = require('./parseVNode');
var is = require('./is');

function unmountComponentAtNode(dom) {

}

function createElm(vnode, insertedVnodeQueue) {

    if (is.undef(vnode)) return document.createDocumentFragment();

    var i, data = vnode.props;
    //if (isDef(data)) {
    //    if (isDef(i = data.hook) && isDef(i = i.init)) {
    //        i(vnode);
    //        data = vnode.data;
    //    }
    // }
    var elm, children = vnode.$vnode.children,
        sel = vnode.sel,
        tag = vnode.type;


    if (is.component(vnode)) {
        insertedVnodeQueue.push(vnode);
        elm = vnode.elm = createElm(children, insertedVnodeQueue);
        return elm;
    }

    if (!is.vtextnode(vnode)) {
        elm = vnode.elm = is.def(i = vnode.ns) ? api.createElementNS(i, tag) :
            api.createElement(tag);
        if (is.def(children)) {
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
                }
            } else {
                api.appendChild(elm, createElm(children, insertedVnodeQueue));
            }
        }
        //for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
        //i = vnode.data.hook; // Reuse variable
        //if (isDef(i)) {
        //    if (i.create) i.create(emptyNode, vnode);
        //    if (i.insert) insertedVnodeQueue.push(vnode);
        // }
    } else {
        elm = vnode.elm = api.createTextNode(vnode.text);
        //api.appendChild(elm, createElm(children));
    }
    return vnode.elm;
}

function render(vnode, dom) {
    var i, elm, parent = dom;
    var insertedVnodeQueue = [];
    //for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    //if (isUndef(oldVnode.sel)) {
    //    oldVnode = emptyNodeAt(oldVnode);
    //}

    //if (sameVnode(oldVnode, vnode)) {
    //    patchVnode(oldVnode, vnode, insertedVnodeQueue);
    //} else {
    //elm = oldVnode.elm;

    if (is.undef(vnode)) return null;

    elm = createElm(vnode, insertedVnodeQueue);

    if (parent !== null) {
        api.insertBefore(parent, elm, api.nextSibling(elm));
        //removeVnodes(parent, [oldVnode], 0, 0);
    }
    //}

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        var $vnode = insertedVnodeQueue[i].$vnode;
        if ($vnode.componentDidMount) {
            $vnode.componentDidMount();
        }
        //insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    //for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();


    console.log(insertedVnodeQueue);

    return vnode;
}

module.exports = {
    render: render
};