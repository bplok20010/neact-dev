var React = require('./ReactClass');
var ReactElement = require('./ReactElement');
var is = require('./is');
var createVNode = require('./parseVNode');
var ReactDOM = require('./render');

React.createElement = ReactElement.createElement;


var Avatar = React.createClass({
    componentDidMount: function() {
        console.log('Avatar componentDidMount');
        this._currentElement.elm.style.border = '1px solid red'

    },
    render: function() {
        return React.createElement('div', {}, React.createElement('img', {
            src: './avatar.png',
            alt: 'test'
        }));
    }
});
var LoginLog = React.createClass({
    componentDidMount: function() {
        console.log('LoginLog componentDidMount')
    },
    render: function() {
        return React.createElement('ul', {},
            React.createElement('li', null, '20160912-1'), [
                React.createElement('li', null, ['20160912-2', 'nobo??']),
                React.createElement('li', null, '20160912-3'),
                React.createElement('li', null, '20160912-4')
            ]);
    }
});

var vnode = React.createElement('div',
    null,
    React.createElement(Avatar),
    React.createElement('span', null, 'nobo'),
    '-',
    null,
    React.createElement('span', null, 'zhou'),
    React.createElement('input'),
    React.createElement('select', null, React.createElement('option')),
    React.createElement(LoginLog)
);

vnode = createVNode(vnode);

ReactDOM.render(vnode, document.body);

//log(vnode)

function log(vnode) {
    console.log(vnode);
    if (is.array(vnode.$vnode.children)) {
        vnode.$vnode.children.forEach(function(node) {
            if (node)
                log(node);
        });
    } else {
        if (vnode.$vnode.children)
            log(vnode.$vnode.children)
    }
}