var is = require('./is');
var util = require('./util');
var element = require('./element');
var DOMComponent = require('./DOMComponent');
var TextDOMComponent = require('./DOMTextComponent');
var CompositeComponent = require('./CompositeComponent');

function createComponent(element) {
    var instance;
    if (typeof element === 'object' && element._instance) {
        return instance;
    }
    if (is.undef(element)) {
        //instance = new ReactEmptyComponent(element);
    } else if (is.textElement(element)) {
        instance = new TextDOMComponent(element);
    } else if (is.compositeElement(element)) {
        instance = new CompositeComponent(element);
    } else {
        instance = new DOMComponent(element);
    }

    return instance;
}

function instantiateComponent(vnode, parentVnode) {
    if (is.undef(vnode)) return vnode; // Empty Node??
    if (is.primitive(vnode)) {
        vnode = element.createTextElement(vnode);
    }

    var vnode = createComponent(vnode);

    vnode.parentNode = parentVnode || null;

    var childs = vnode.render();

    if (is.array(childs)) {
        vnode.children = util.map(childs, function(node) {
            return instantiateComponent(node, vnode);
        });
    } else if (is.def(childs)) {
        vnode.children = instantiateComponent(childs, vnode);
    }

    return vnode;
}

module.exports = instantiateComponent;