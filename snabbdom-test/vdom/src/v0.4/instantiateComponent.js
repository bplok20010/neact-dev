var is = require('./is');
var util = require('./util');
var element = require('./vnode');
var DOMComponent = require('./DOMComponent');
var TextDOMComponent = require('./DOMTextComponent');
var CompositeComponent = require('./CompositeComponent');
var EmptyComponent = require('./EmptyComponent');

function createComponent(element) {
    var instance;
    //if (typeof element === 'object' && element._instance) {
    //    return element;
    //}
    if (is.invalid(element)) {
        instance = new EmptyComponent();
    } else if (is.textElement(element)) {
        instance = new TextDOMComponent(element);
    } else if (is.compositeElement(element)) {
        instance = new CompositeComponent(element);
    } else if (typeof element.type === 'string') {
        instance = new DOMComponent(element);
    }

    return instance;
}
/**
 * 确保vnode 经过invalid处理
 */
function instantiateComponent(vnode, parentVnode) {
    //if (is.primitive(vnode)) {
    //    vnode = element.createTextElement(vnode);
    //}

    var inst = createComponent(vnode);

    inst.parentNode = parentVnode || null;

    if (is.compositeComponent(inst)) {
        inst.componentWillMount();
    }

    if (is.emptyComponent(inst) || is.domTextComponent(inst)) {
        return inst;
    }

    var childs = inst.render();

    if (is.compositeComponent(inst)) {
        inst.children = instantiateComponent(childs, inst);
    } else {

        if (is.array(childs)) {
            inst.children = util.map(childs, function(node) {
                if (is.invalid(node)) return null;
                return instantiateComponent(node, inst);
            });
        } else if (!is.invalid(childs)) {
            inst.children = instantiateComponent(childs, inst);
        }

    }

    return inst;
}

module.exports = instantiateComponent;