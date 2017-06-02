var is = require('./is');
var util = require('./util');
var element = require('./vnode');
var DOMComponent = require('./DOMComponent');
var TextDOMComponent = require('./DOMTextComponent');
var CompositeComponent = require('./CompositeComponent');
var EmptyComponent = require('./EmptyComponent');

function createComponent(element) {
    var instance;
    if (typeof element === 'object' && element._instance) {
        return instance;
    }

    if (is.textElement(element)) {
        instance = new TextDOMComponent(element);
    } else if (is.compositeElement(element)) {
        instance = new CompositeComponent(element);
    } else if (typeof element.type === 'string') {
        instance = new DOMComponent(element);
    } else {
        instance = new EmptyComponent();
    }

    return instance;
}
/**
 * 确保vnode 经过invalid处理
 */
function instantiateComponent(vnode, parentVnode) {
    if (is.primitive(vnode)) {
        vnode = element.createTextElement(vnode);
    }

    //if (is.invalid(vnode)) return null;

    var vnode = createComponent(vnode);

    vnode.parentNode = parentVnode || null;

    if (is.compositeComponent(vnode)) {
        var instance = vnode._instance;
        if (instance.componentWillMount) {
            instance.componentWillMount();
        }
    }

    var childs = vnode.render();

    if (is.array(childs)) {
        vnode.children = util.map(childs, function(node) {
            if (is.invalid(node)) return null;
            return instantiateComponent(node, vnode);
        });
    } else if (is.def(childs)) {
        vnode.children = is.invalid(childs) ? null : instantiateComponent(childs, vnode);
    }

    return vnode;
}

module.exports = instantiateComponent;