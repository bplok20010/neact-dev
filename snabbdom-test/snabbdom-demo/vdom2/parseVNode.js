var is = require('./is');
var util = require('./util');
var instantiateReactComponent = require('./instantiateReactComponent');

function createVnode(vnode, parentVnode) {
    if (is.undef(vnode)) return vnode;

    var vnode = instantiateReactComponent(vnode);

    vnode.parentNode = parentVnode;

    var childs = vnode.getRenderChildren();

    if (is.array(childs)) {
        vnode.children = util.map(childs, function(node) {
            return createVnode(node, vnode);
        });
    } else if (is.def(childs)) {
        vnode.children = createVnode(childs, vnode);
    }

    return vnode;
}

module.exports = createVnode;