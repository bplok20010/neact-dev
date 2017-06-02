var is = require('./is');
var util = require('./util');
var patch = require('./patch');

function ClassComponent(props, context) {}

util.merge(ClassComponent.prototype, {
    setState: function(newState, callback) {
        var inst = this._instanceCompositeComponent;

        if (inst._unmounted) {
            return;
        }

        if (is.function(newState)) {
            newState = newState(this.state);
        }
        for (var key in newState) {
            this.state[key] = newState[key];
        }

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
    }
});

function Component(props, context) {
    this.props = props || {};
    this.context = context || {};
}

util.inherits(Component, ClassComponent);


module.exports = {

    Component: Component,

    createClass: function(spec) {
        function Constructor(props, context) {
            this.props = props || {};
            this.state = null;
            this.context = context;

            var initialState = this.getInitialState ? this.getInitialState() : null;

            if (!(typeof initialState === 'object' && !is.array(initialState))) {
                new TypeError('getInitialState(): must return an object or null');
            }

            this.state = initialState;
        }

        util.inherits(Constructor, ClassComponent, spec);

        Constructor.prototype.constructor = Constructor;

        if (Constructor.getDefaultProps) {
            Constructor.defaultProps = Constructor.getDefaultProps();
        }

        if (!Constructor.prototype.render) {
            new TypeError('createClass(...): Class specification must implement a `render` method.');
        }

        return Constructor;
    }
};