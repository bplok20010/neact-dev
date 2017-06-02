var React = require('./ReactClass');
var ReactElement = require('./ReactElement');
React.createElement = ReactElement.createElement;
var is = require('./is');
var instantiateReactComponent = require('./instantiateReactComponent');
var ReactDOM = require('./render');



var Avatar = React.createClass({
    componentDidMount: function() {
        console.log('Avatar componentDidMount');
        console.log(this._instance, '?');
        this._instance.getDOM().style.border = '1px solid red';
        this._instance.getParentDOM().style.border = '1px solid green';
        // this._currentElement.elm.style.border = '1px solid red'

    },
    render: function() {
        return React.createElement(
            'div', {},
            React.createElement('img', {
                src: './avatar.png',
                alt: 'test'
            }));
    }
});

var s = 6;
var k = 'a';
var t = 2000;
var LoginLog = React.createClass({
    componentDidMount: function() {
        var self = this;
        console.log('LoginLog componentDidMount');

        function ss() {
            setTimeout(function() {
                self.forceUpdate();
                k = 'b' + s;
                t += 10000;
                ss();
            }, t);
        }

        ss();


    },
    render: function() {
        var childs = [];
        for (var i = 1; i <= s; i++) {
            childs.push(
                React.createElement('li', { key: i }, '20160912-' + i + k)
            );
        }

        childs.push(React.createElement(Avatar, {
            key: 'avatar'
        }));

        childs.sort(function() {
            return 0.5 - Math.random();
        });
        s = s + 2
        return React.createElement('ul', {}, childs);
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

//vnode = createVNode(vnode);

var render = ReactDOM.render(React.createElement(LoginLog), document.body);

window.render = render;

//render.updateRenderChildren();

console.log(render, 'dd')

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