var is = require('./is');
var util = require('./util');
var Component = require('./Component');

function ReactClassComponent() {}

util.inherits(ReactClassComponent, Component, {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
        this.updater.enqueueReplaceState(this, newState);
        if (callback) {
            this.updater.enqueueCallback(this, callback, 'replaceState');
        }
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {

    }
});

var Class = {
    createClass: function(spec) {
        function Constructor(props, context) {
            this.props = props;
            this.state = null;
            this.context = context;

            var initialState = this.getInitialState ? this.getInitialState() : null;

            if (!(typeof initialState === 'object' && !is.array(initialState))) {
                new TypeError('getInitialState(): must return an object or null');
            }

            this.state = initialState;
        }

        util.inherits(Constructor, ReactClassComponent, spec)

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

module.exports = Class;