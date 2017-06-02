module.exports = {
    array: Array.isArray,
    vcomponent: function(d) {
        return typeof d.sel === 'function';
    },
    vcmp1: function(d) {
        return !!d.vcomponent();
    },
    primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
};