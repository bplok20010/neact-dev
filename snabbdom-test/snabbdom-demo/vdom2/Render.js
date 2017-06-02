var api = require('./dom');
var parseVNode = require('./parseVNode');
var is = require('./is');
//var instantiateReactComponent = require('./instantiateReactComponent');

function unmountComponentAtNode(dom) {}

function createElm(vnode, parent, insertedVnodeQueue) {

    if (is.undef(vnode)) return document.createDocumentFragment();

    var i, data = vnode.props;
    var elm = vnode.elm,
        instance = vnode._instance,
        children = vnode.children;

    if (is.classComponent(instance)) {
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

    vnode = parseVNode(vnode, {
        elm: parent
    });


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
    //  console.log(insertedVnodeQueue);

    return vnode;
}

module.exports = {
    render: render,
    createElm: createElm
};