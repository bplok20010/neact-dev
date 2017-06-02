'use strict';

var util = require('./util');
var NeactComponent = require('./NeactComponent');

function NeactPureComponent(props, context) {
    this.props = props;
    this.context = context;
    this.refs = {};
    this.state = null;
}

function ComponentDummy() {}
ComponentDummy.prototype = NeactComponent.prototype;
NeactPureComponent.prototype = new ComponentDummy();
NeactPureComponent.prototype.constructor = NeactPureComponent;

NeactPureComponent.prototype.isPureNeactComponent = true;

module.exports = NeactPureComponent;