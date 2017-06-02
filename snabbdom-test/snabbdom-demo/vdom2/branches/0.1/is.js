module.exports = {
    array: Array.isArray,
    vtextnode: function(vnode) {
        return this.def(vnode.text);
    },
    component: function(d) {
        return typeof d.type === 'function';
    },
    primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
    undef: function(s) {
        return s === undefined || s === null;
    },
    def: function(s) {
        return s !== undefined && s !== null;
    },
    dom: function(obj) {
        return obj && obj.nodeType === 1 &&
            typeof(obj.nodeName) == 'string';
    }
};