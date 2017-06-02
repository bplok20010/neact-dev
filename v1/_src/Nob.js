'use strict';
var element = require('./vnode');
var Class = require('./createClass');
var Mount = require('./mount');
//
var Nob = {
    createElement: element.createElement,
    createTextElement: element.createTextElement,
    createFactory: element.createFactory,
    isValidElement: element.isValidElement,
    createClass: Class.createClass,
    render: Mount.render
};

module.exports = Nob;