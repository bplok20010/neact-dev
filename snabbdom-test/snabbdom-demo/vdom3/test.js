var React = require('./Nob');

var Avatar = React.createClass({
    componentDidMount: function() {
        console.log('Avatar componentDidMount');
        this._instanceCompositeComponent.getDOM().style.border = '1px solid red';
        this._instanceCompositeComponent.getParentDOM().style.border = '1px solid green';

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

var LoginLog = React.createClass({
    componentDidMount: function() {
        console.log('?')
    },
    render: function() {
        var childs = [];
        for (var i = 1; i <= s; i++) {
            childs.push(
                React.createElement('li', { key: i }, '20160912-' + i)
            );
        }

        childs.push(React.createElement(Avatar, {
            key: 'avatar'
        }));

        childs.sort(function() {
            return 0.5 - Math.random();
        });

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

var render = React.render(React.createElement(LoginLog), document.body);

window.render = render;