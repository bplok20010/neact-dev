'use strict';

/** @jsx Neact.createElement */

var num = 0;

var Avatar = Neact.createClass({
    componentWillUnmount: function componentWillUnmount() {
        console.log('Avatar componentWillUnmount');
    },
    componentDidMount: function componentDidMount() {
        console.log('Avatar componentDidMount');
        this._instanceCompositeComponent.getDOM().style.border = '1px solid red';
        this._instanceCompositeComponent.getParentDOM().style.border = '1px solid green';
    },
    render: function render() {
        /*
        onComponentWillMount: true,
            onComponentDidMount: true,
            onComponentWillUpdate: true,
            onComponentDidUpdate: true,
            onComponentWillUnmount: true
        */
        return Neact.createElement(
            'div',
            null,
            Neact.createElement('img', {
                onComponentWillMount: function onComponentWillMount(a, b, c, d) {
                    return console.log('onComponentWillMount', a, b, c, d);
                },
                onComponentDidMount: function onComponentDidMount(a, b, c, d) {
                    return console.log('onComponentDidMount', a, b, c, d);
                },
                onComponentWillUpdate: function onComponentWillUpdate(a, b, c, d) {
                    return console.log('onComponentWillUpdate', a, b, c, d);
                },
                onComponentDidUpdate: function onComponentDidUpdate(a, b, c, d) {
                    return console.log('onComponentDidUpdate', a, b, c, d);
                },
                onComponentWillUnmount: function onComponentWillUnmount(a, b, c, d) {
                    return console.log('onComponentWillUnmount', a, b, c, d);
                },
                alt: 'test', width: '50', height: '50', src: !(x % 2) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg' })
        );
    }
});

var TextNode = Neact.createClass({
    componentDidMount: function componentDidMount() {
        console.log('TextNode componentDidMount');
    },
    render: function render() {
        return null; //'[nobo]'
    }
});

var Li = Neact.createClass({
    componentWillReceiveProps: function componentWillReceiveProps(p) {
        // console.log('Li componentWillReceiveProps')
    },
    componentWillUnmount: function componentWillUnmount() {
        // console.log('Li componentWillUnmount' + this.props.idx);
    },
    componentDidMount: function componentDidMount() {
        // console.log('Li componentDidMount' + this.props.idx);
    },
    componentWillUpdate: function componentWillUpdate() {
        // console.log('Li componentWillUpdate')
    },
    componentDidUpdate: function componentDidUpdate() {
        //   console.log('Li componentDidUpdate')
    },
    render: function render() {
        return Neact.createElement('li', {
            className: x % 2 ? 'a' : 'b',
            onClick: function onClick(e) {
                console.log(e, 4);
            }
        }, '20160912-', null, this.props.idx, '-', x, Neact.createElement('input', {
            defaultValue: 'nobo' + s,
            onInput: function onInput(e) {
                console.log(e.type);
            }
        }));
    }
});

var SvgPath = Neact.createClass({
    render: function render() {
        return 'ss';
        return Neact.createElement('svg', {
            width: 1200,
            height: 360,
            xmlns: "http://www.w3.org/2000/svg"
        }, Neact.createElement('path', {
            d: "M50 50\
                C153 334 151 334 151 334\
                C151 339 153 344 156 344\
                C164 344 171 339 171 334\
                C171 322 164 314 156 314\
                C142 314 131 322 131 334\
                C131 350 142 364 156 364\
                C175 364 191 350 191 334\
                C191 311 175 294 156 294\
                C131 294 111 311 111 334\
                C111 361 131 384 156 384\
                C186 384 211 361 211 334\
                C211 300 186 274 156 274 "
        }));
    }
});

var s = 10;
var x = 1;
var t = 18;
var timer = 100;

var LoginLog = Neact.createClass({
    getInitialState: function getInitialState() {
        return {
            name: 'nobo'
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            name2: 'nobo'
        };
    },
    componentDidMount: function componentDidMount() {
        var self = this;
        console.log(this.refs, 'refs');
        // setInterval  setTimeout
        setInterval(function () {
            if (stop) return;

            stop = true;

            console.clear();

            x++;

            if (s > 10) {
                s -= 2;
            } else {
                s += 2;
            }

            //console.time('update')
            self.setState({ m: s });
            //console.timeEnd('update')
        }, timer);

        return;

        setTimeout(function () {
            s = 0;
            console.time('update');
            self.forceUpdate();
            console.timeEnd('update');

            setTimeout(function () {
                s = 8;
                console.time('update');
                self.forceUpdate();
                console.timeEnd('update');

                setTimeout(function () {
                    s = 20;
                    console.time('update');
                    self.forceUpdate();
                    console.timeEnd('update');

                    setInterval(function () {
                        x++;
                        s += 5;

                        console.time('update');
                        self.forceUpdate();
                        console.timeEnd('update');
                    }, 500);

                    //self.componentDidMount();
                }, 500);
            }, 500);
        }, 500);
    },
    componentDidUpdate: function componentDidUpdate() {
        console.log(this.refs, 'refs');
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        console.log('LoginLog shouldComponentUpdate', nextProps, nextState, this.state, this.props);
    },
    render: function render() {
        var self = this;
        var childs = [];
        for (var i = 1; i <= s; i++) {
            childs.push(Neact.createElement(Li, { key: i, idx: i, ref: 'ref ' + i + ' ' + t })
            //Neact.createElement('li', { key: i }, '20160912-' + i, Neact.createElement('input'))
            );
        }

        //console.log(this);

        if (childs.length) {

            childs.push(Neact.createElement(Avatar, {
                ref: 'avatar',
                key: 'avatar'
            }));

            childs.push('a');
            childs.push(null);
            childs.push('b');
        }

        childs.sort(function () {
            return 0.5 - Math.random();
        });

        if (childs.length < 1) childs = null;

        if (childs)
            // childs.length = Math.min(10, childs.length);

            //s = 10;

            if (s > 30) {
                s = 10;
            }

        // s += 1
        //console.log(s)

        t++;

        if (t > 35) {
            t = 15;
        }

        if (t == 30 && childs) {
            childs.length = 0;
        }

        if (t == 32 && childs) {
            childs = null;
        }

        var ds = Neact.createElement(
            'div',
            { style: {
                    border: '5px solid gray'
                } },
            Neact.createElement(
                'ul',
                null,
                childs
            )
        );

        return t > 20 ? ds : Neact.createElement(
            'ul',
            { ref: 'ul' },
            childs,
            'nobo??'
        ); //Neact.createElement('ul', {}, childs, null, null, 'nobo??');
    }
});

var A0 = Neact.createClass({
    render: function render() {
        return null;
    }
});

var A1 = Neact.createClass({
    render: function render() {
        return Neact.createElement(A0);
    }
});

var vnode = Neact.createElement('div', null, Neact.createElement(Avatar), Neact.createElement(SvgPath), Neact.createElement('span', null, 'nobo'), '-', null, 0, Neact.createElement('span', null, 'zhou'), Neact.createElement('input'), Neact.createElement('select', {
    multiple: true
}, Neact.createElement('option', null, 1), Neact.createElement('option', null, 2), Neact.createElement('option', null, 3)), Neact.createElement(LoginLog, { key: 'log' }), Neact.createElement(TextNode), '--------component return null test--------');

var render = Neact.render(vnode, document.body);

//var render1 = Neact.render(Neact.createElement(A1), document.body);


window.render = render;