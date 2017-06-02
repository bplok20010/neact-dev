'use strict';
var NeactElement = require('./NeactElement');
var NeactClass = require('./NeactClass');
var NeactMount = require('./NeactMount');

var Neact = {
    createElement: NeactElement.createElement,
    createTextElement: NeactElement.createTextElement,
    createFactory: NeactElement.createFactory,
    isValidElement: NeactElement.isValidElement,
    createClass: NeactClass.createClass,
    render: NeactMount.render,
    unmountComponentAtNode: null
};

module.exports = Neact;