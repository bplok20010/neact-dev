var is = require('./is');
var util = require('./util');
var createTextElement = require('./NeactElement').createTextElement;
var createVoidElement = require('./NeactElement').createVoidElement;
var NeactDOMComponent = require('./NeactDOMComponent');
var NeactDOMTextComponent = require('./NeactDOMTextComponent');
var NeactCompositeComponent = require('./NeactCompositeComponent');
var NeactEmptyComponent = require('./NeactEmptyComponent');

function createComponent(element) {
    var instance;
    //if (typeof element === 'object' && element._instance) {
    //    return element;
    //}

    if (is.invalid(element) || is.invalidElement(element)) {
        instance = new NeactEmptyComponent();
    } else if (is.textElement(element) || is.primitive(element)) {
        instance = new NeactDOMTextComponent(element);
    } else if (is.compositeElement(element)) {
        instance = new NeactCompositeComponent(element);
    } else if (typeof element.type === 'string') {
        instance = new NeactDOMComponent(element);
    } else {
        throw new TypeError('unknow error')
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

    inst._unmounted = false;

    if (is.compositeComponent(inst)) {
        inst.componentWillMount();
    }

    if (is.emptyComponent(inst) || is.domTextComponent(inst)) {
        return inst;
    }

    var isSvg = vnode.isSvg;

    var childs = inst.render();

    if (is.compositeComponent(inst)) {
        if (is.primitive(childs)) {
            childs = createTextElement(childs);
        } else if (is.invalid(childs)) {
            childs = createVoidElement();
        }
        inst.children = instantiateComponent(childs, inst);
    } else {

        //if (1) {

        if (is.array(childs)) {
            var renderChilds = [];
            for (var i = 0; i < childs.length; i++) {
                var node = childs[i];
                if (is.invalid(node)) continue;
                if (is.primitive(node)) {
                    node = createTextElement(node);
                }
                node.isSvg = isSvg;
                renderChilds.push(instantiateComponent(node, inst));
            }
            inst.children = renderChilds;
        } else if (!is.invalid(childs)) {
            if (is.primitive(childs)) {
                childs = createTextElement(childs);
            }
            childs.isSvg = isSvg;
            inst.children = instantiateComponent(childs, inst);
        }

        //} else {
        /*
        if (is.array(childs)) {
            inst.children = util.map(childs, function(node) {
                if (is.invalid(node)) return null;
                node.isSvg = isSvg;
                return instantiateComponent(node, inst);
            });
        } else if (!is.invalid(childs)) {
            childs.isSvg = isSvg;
            inst.children = instantiateComponent(childs, inst);
        }
        */
        //}

    }

    return inst;
}

module.exports = instantiateComponent;