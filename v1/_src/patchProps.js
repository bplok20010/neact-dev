var is = require('./is');

function patchProps(lastProps, nextProps, dom, isSVG) {
    lastProps = lastProps || {};
    nextProps = nextProps || {};

    for (var prop in nextProps) {
        dom.setAttribute(prop, nextProps[prop]);
    }
}

module.exports = {
    patchProps: patchProps
};