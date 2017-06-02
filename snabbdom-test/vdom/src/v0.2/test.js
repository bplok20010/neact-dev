var React = require('./Nob');

var Avatar = React.createClass({
    componentWillUnmount: function() {
        console.log('Avatar componentWillUnmount' + this.props.idx);
    },
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

var TextNode = React.createClass({
    componentDidMount: function() {
        console.log('TextNode componentDidMount');
    },
    render: function() {
        return null; //'[nobo]'
    }
});

var Li = React.createClass({
    componentWillUnmount: function() {
        console.log('Li componentWillUnmount' + this.props.idx);
    },
    componentDidMount: function() {
        console.log('Li componentDidMount' + this.props.idx);
    },
    render: function() {
        return React.createElement('li', null, '20160912-' + this.props.idx, React.createElement('input'))
    }
});

var s = 10;

var LoginLog = React.createClass({
    componentDidMount: function() {
        console.log('+?');
        var self = this;


        setTimeout(function() {
            s = 0;
            console.time('update')
            self.forceUpdate();
            console.timeEnd('update')

            setTimeout(function() {
                s = 8;
                console.time('update')
                self.forceUpdate();
                console.timeEnd('update')

                setTimeout(function() {
                    s = 20;
                    console.time('update')
                    self.forceUpdate();
                    console.timeEnd('update')

                    self.componentDidMount();
                }, 2000);
            }, 2000);
        }, 2000);
    },
    shouldComponentUpdate: function() {
        //console.log('LoginLog shouldComponentUpdate');
    },
    render: function() {
        var self = this;
        var childs = [];
        for (var i = 1; i <= s; i++) {
            childs.push(
                React.createElement(Li, { key: i, idx: i })
                //React.createElement('li', { key: i }, '20160912-' + i, React.createElement('input'))
            );
        }

        if (childs.length) {

            childs.push(React.createElement(Avatar, {
                key: 'avatar'
            }));
        }

        childs.sort(function() {
            return 0.5 - Math.random();
        });

        if (childs.length < 1) childs = null;

        //childs.length = 6;

        // s += 1



        return s == 20 ? React.createElement('div', {}, React.createElement('ul', {}, childs)) : React.createElement('ul', {}, childs);
    }
});

var vnode = React.createElement('div',
    null,
    React.createElement(Avatar),
    React.createElement('span', null, 'nobo'),
    '-',
    null,
    0,
    React.createElement('span', null, 'zhou'),
    React.createElement('input'),
    React.createElement('select', null, React.createElement('option')),
    React.createElement(LoginLog),
    React.createElement(TextNode)
);

var render = React.render(vnode, document.body);

window.render = render;