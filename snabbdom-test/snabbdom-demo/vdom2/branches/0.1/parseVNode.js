var is = require('./is');
var util = require('./util');
var React = require('./ReactElement');

function createTextVNode(text) {
    var vnode = React.createElement(null);
    vnode.text = text;
    vnode.$vnode = {
        _currentElement: vnode
    }; // children: null

    return vnode;
}

function createElementVNode(vnode) {
    //if (vnode.props) {
    vnode.$vnode = {
        children: vnode.props.children,
        _currentElement: vnode
    };
    //}
    return vnode;
}

function createComponentVNode(vnode) {
    vnode.$vnode = new vnode.type(vnode.props);
    vnode.$vnode.children = vnode.$vnode.render();
    vnode.$vnode._currentElement = vnode;
    return vnode;
}

function createSvgVNode(vnode) {
    vnode.ns = 'http://www.w3.org/2000/svg';
    return createElementVNode(vnode);
}

function createVnode(vnode) {
    if (is.undef(vnode)) return vnode;
    if (is.primitive(vnode)) {
        return createTextVNode(vnode);
    }
    if (is.component(vnode)) {
        vnode = createComponentVNode(vnode);
    } else {
        if (/^svg$/i.test(vnode.type)) {
            vnode = createSvgVNode(vnode);
        } else {
            vnode = createElementVNode(vnode);
        }
    }
    var childs = vnode.$vnode.children;

    if (is.array(childs)) {
        vnode.$vnode.children = util.map(util.flatten(childs), function(node) {
            return createVnode(node)
        });
    } else if (is.def(childs)) {
        vnode.$vnode.children = createVnode(childs);
    }

    return vnode;
}

module.exports = createVnode;