var VNode = require('./vnode');
var is = require('./is');

module.exports = function(component, props, children) {
    if (is.vcomponent(component)) {
        return h(component, props, children);
    } else {
        return h(component, props, children);
    }
}