'use strict';
var is = require('./is');
var util = require('./util');
var NeactClassMixin = require('./NeactClassMixin');

function ClassComponent(props, context) {}

util.assign(ClassComponent.prototype, NeactClassMixin);

module.exports = {
    createClass: function(spec) {
        function Constructor(props, context) {
            this.refs = {};
            this.props = props || {};
            this.context = context;
            this.state = null;

            if (this.construct) {
                this.construct(props, context);
                return;
            }

            var initialState = this.getInitialState ? this.getInitialState(this.props) : null;

            if (!(typeof initialState === 'object' && !is.array(initialState))) {
                new TypeError('getInitialState(): must return an object or null');
            }

            this.state = initialState;
        }

        util.inherits(Constructor, ClassComponent, spec);

        Constructor.prototype.constructor = Constructor;

        if (spec.getDefaultProps) {
            Constructor.defaultProps = spec.getDefaultProps();
        }

        if (!Constructor.prototype.render) {
            new TypeError('createClass(...): Class specification must implement a `render` method.');
        }

        return Constructor;
    }
};