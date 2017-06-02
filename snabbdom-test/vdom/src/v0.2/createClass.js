var is = require('./is');
var util = require('./util');
var patch = require('./patch');

function ClassComponent(props, context) {}

ClassComponent.prototype.setState = function(partialState, callback) {};

ClassComponent.prototype.forceUpdate = function(callback) {
    var i, self = this;
    var insertedVnodeQueue = [];
    //setTimeout(function() {
    patch.patchVnode(self._instanceCompositeComponent, self._instanceCompositeComponent._currentElement, insertedVnodeQueue);
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        var instance = insertedVnodeQueue[i]._instance;
        if (instance.componentDidMount) {
            instance.componentDidMount();
        }
    }
    //}, 0);
}

ClassComponent.prototype.isMounted = function(callback) {

}

module.exports = {
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

        util.inherits(Constructor, ClassComponent, spec)

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