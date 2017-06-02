'use strict';

var util = require('./util');
var patch = require('./patch');

var NeactClassMixin = {
    setState: function(newState, callback) {
        var inst = this._instanceCompositeComponent;

        if (inst._unmounted) {
            return;
        }

        if (typeof newState === 'function') {
            newState = newState(this.state);
        }

        inst._nextState = util.assign({}, this.state || {}, newState || {});

        this.forceUpdate(callback);
    },
    forceUpdate: function(callback) {
        var inst = this._instanceCompositeComponent;

        if (inst._unmounted) {
            return;
        }

        patch.patchVnode(inst, inst._currentElement);

        if (callback) {
            callback();
        }
    },

    isMounted: function() {
        return !this._unmounted;
    },

    getInstance: function() {
        return this._instanceCompositeComponent;
    }
}

module.exports = NeactClassMixin;