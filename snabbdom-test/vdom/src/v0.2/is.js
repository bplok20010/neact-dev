var objToString = Object.prototype.toString;
var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

module.exports = {
    DOM_NODE: 1,
    CLASS_NODE: 2,
    TEXT_NODE: 3,
    EMPTY_NODE: 11,
    array: isArray,
    vtextnode: function(vnode) {
        return this.def(vnode.text);
    },
    primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
    undef: function(s) {
        return s === undefined || s === null;
    },
    invalid: function(s) {
        return s === null || s === false || s === true || s === undefined;
    },
    def: function(s) {
        return s !== undefined && s !== null;
    },
    textElement: function(element) {
        return element.type === '#text' && this.def(element.props.text);
    },
    compositeElement: function(element) {
        return typeof element.type === 'function';
    },
    domElement: function(element) {
        return !this.textElement(element) && !this.compositeElement(element) && typeof element.type === 'string';
    },
    compositeComponent: function(inst) {
        return !!inst._isCompositeComponent;
    },
    dom: function(obj) {
        return obj && obj.nodeType === 1 &&
            typeof(obj.nodeName) == 'string';
    },
    textNode: function(obj) {
        return obj.nodeType === 3;
    },
    sameVnode: function(vnode1, vnode2) {
        return (vnode1.key) === vnode2.key && vnode1.type === vnode2.type;
    },

};