var objToString = Object.prototype.toString;
var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

module.exports = {
    array: isArray,
    string: function(obj) {
        return typeof obj === 'string';
    },
    number: function(obj) {
        return typeof obj === 'number';
    },
    'function': function(obj) {
        return typeof obj === 'function';
    },
    object: function(obj) {
        return typeof obj === 'object';
    },
    vtextnode: function(vnode) {
        return this.def(vnode.text);
    },
    attrEvent: function(attr) {
        return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
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
    vnode: function(vnode) {
        return vnode && vnode.type;
    },
    textElement: function(element) {
        return element.type === '#text' && this.def(element.props.text);
    },
    invalidElement: function(element) {
        return element.type === '#comment';
    },
    compositeElement: function(element) {
        return typeof element.type === 'function';
    },
    domElement: function(element) {
        return !this.textElement(element) && !this.compositeElement(element) && typeof element.type === 'string';
    },
    component: function(inst) {
        return inst._isComponent;
    },
    compositeComponent: function(inst) {
        return inst._isCompositeComponent;
    },
    domComponent: function(inst) {
        return inst._isDOMComponent;
    },
    domTextComponent: function(inst) {
        return inst._isDOMTextComponent;
    },
    emptyComponent: function(inst) {
        return inst._isEmptyComponent;
    },
    dom: function(obj) {
        return obj && obj.nodeType === 1 &&
            typeof(obj.nodeName) == 'string';
    },
    textNode: function(obj) {
        return obj.nodeType === 3;
    },
    sameVnode: function(inst, vnode) {
        if (this.emptyComponent(inst)) {
            if (this.invalid(vnode)) return true;
            else return false;
        } else if (this.invalid(vnode)) {
            return false;
        }

        return inst.key === vnode.key && inst.type === vnode.type;
    }

};