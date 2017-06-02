/**
 * author nobo<zere.nobo@gmail.com>
 * 
 * */

'use strict';

var NeactRefsMixin = {
    shouldUpdateRefs: function(nextElement) {
        var prevElement = this._currentElement;
        var prevRef = null;
        var prevOwner = null;
        if (prevElement !== null && typeof prevElement === 'object') {
            prevRef = prevElement.ref;
            prevOwner = prevElement._owner;
        }

        var nextRef = null;
        var nextOwner = null;
        if (nextElement !== null && typeof nextElement === 'object') {
            nextRef = nextElement.ref;
            nextOwner = nextElement._owner;
        }

        return prevRef !== nextRef ||
            // If owner changes but we have an unchanged function ref, don't update refs
            typeof nextRef === 'string' && nextOwner !== prevOwner;
    },

    _attachRef: function() {
        var element = this._currentElement;
        var owner = element._owner;
        var ref = element.ref;
        if (ref && owner) {
            owner.attachRef(ref, this);
        }
    },

    attachRef: function(ref, component) {
        var vnode = this._instance;
        var refs = vnode.refs;
        if (typeof ref === 'function') {
            ref(component._instance);
        } else {
            refs[ref] = component._instance;
        }
    },

    _detachRef: function() {
        var element = this._currentElement;
        var owner = element._owner;
        var ref = element.ref;
        if (ref && owner) {
            owner.detachRef(ref);
        }
    },

    detachRef: function(ref) {
        var vnode = this._instance;
        var refs = vnode.refs;
        if (typeof ref === 'function') {
            ref(null);
        } else {
            delete refs[ref];
        }
    }
};

module.exports = NeactRefsMixin;