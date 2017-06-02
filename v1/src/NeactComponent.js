'use strict';

var util = require('./util');
var NeactClassMixin = require('./NeactClassMixin');

function NeactComponent(props, context) {
    this.props = props;
    this.context = context;
    this.refs = {};
    this.state = null;
}

util.assign(NeactComponent.prototype, NeactClassMixin);

module.exports = NeactComponent;