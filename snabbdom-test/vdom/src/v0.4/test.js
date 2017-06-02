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
                width: 40,
                height: 40,
                src: x % 2 ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg',
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
    componentWillReceiveProps: function(p) {
        // console.log('Li componentWillReceiveProps')
    },
    componentWillUnmount: function() {
        // console.log('Li componentWillUnmount' + this.props.idx);
    },
    componentDidMount: function() {
        // console.log('Li componentDidMount' + this.props.idx);
    },
    componentWillUpdate: function() {
        // console.log('Li componentWillUpdate')
    },
    componentDidUpdate: function() {
        //   console.log('Li componentDidUpdate')
    },
    render: function() {
        return React.createElement('li', {
            className: x % 2 ? 'a' : 'b',
            onClick: function() {
                console.log(4);
            }
        }, '20160912-', null, this.props.idx, '-', x, React.createElement('input'))
    }
});

var s = 10;
var x = 1;
var t = 1;

var LoginLog = React.createClass({
    componentDidMount: function() {
        console.log('+?');
        var self = this;

        setInterval(function() {
            x++;


            if (s > 10) {
                s -= 2;
            } else {
                s += 2;
            }

            console.time('update')
            self.forceUpdate();
            console.timeEnd('update')
        }, 500);

        return;

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
                    console.timeEnd('update');

                    setInterval(function() {
                        x++;
                        s += 5;

                        console.time('update')
                        self.forceUpdate();
                        console.timeEnd('update')
                    }, 500);

                    //self.componentDidMount();
                }, 500);
            }, 500);
        }, 500);
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

            childs.push('a');
            childs.push(null);
            childs.push('b')
        }

        childs.sort(function() {
            return 0.5 - Math.random();
        });

        if (childs.length < 1) childs = null;

        if (childs)
        // childs.length = Math.min(10, childs.length);

        //s = 10;

            if (s > 30) {
                s = 10
            }

            // s += 1
            //console.log(s)

        t++;

        if (t > 40) {
            t = 1;
        }

        if (t == 30 && childs) {
            childs.length = 0;
        }

        if (t == 32 && childs) {
            childs = null;
        }

        return t > 20 ?
            React.createElement('div', { style: { border: '5px solid gray' } }, React.createElement('ul', {}, childs)) :
            React.createElement('ul', {}, childs, null, null, 'nobo??');
    }
});

var A0 = React.createClass({
    render: function() {
        return null;
    }
});

var A1 = React.createClass({
    render: function() {
        return React.createElement(A0)
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
    React.createElement('select', {
            multiple: true
        },
        React.createElement('option', null, 1),
        React.createElement('option', null, 2),
        React.createElement('option', null, 3)
    ),
    React.createElement(LoginLog),
    React.createElement(TextNode),
    '--------component return null test--------'
);

var render = React.render(vnode, document.body);

var render1 = React.render(React.createElement(A1), document.body);


window.render = render;