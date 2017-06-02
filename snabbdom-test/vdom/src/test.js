var React = require('./Nob');

num = 0;


var TreeStore = [{
    text: '跟节点',
    children: [{ text: '文件夹<strong>A</strong>', expand: false, children: [{ text: '文件.txt' }], leaf: false }, { text: '文件夹B', leaf: false, children: [{ text: '文件夹X', leaf: false }] }, { text: '文件夹C', leaf: false }, { text: '文件夹D', leaf: false }].concat(function() {
        var count = 3000;
        var d = [];
        for (var i = 1; i <= count; i++) {
            d.push({
                text: '文件夹' + i,
                leaf: false
            });
        }
        return d;
    }())
}];


var Tree = React.createClass({
    getInitialState: function() {
        return {
            idx: 1
        }
    },
    isLeaf: function isLeaf(node) {
        return node.leaf === undefined ? true : node.leaf;
    },
    addChild: function addChild(pnode) {
        if (!pnode.children) {
            pnode.children = [];
        }

        pnode.children.push({
            text: '文件' + this.state.idx++
        });

        pnode.expand = true;
        sTotal = 0;
        isInit = false;

        console.time('tree')
        this.forceUpdate();
        console.timeEnd('tree')
        console.log(sTotal);

    },
    removeChild: function removeChild(childs, i) {

        childs.splice(i, 1);

        this.forceUpdate();
    },
    getChildItem: function getChildItem(data) {
        var _this = this;

        var child = data.children;
        if (!child) return [];
        return React.createElement('ul', {
            style: { display: data.expand === false ? 'none' : 'block' }
        }, child.map(function(node, i) {
            return React.createElement(
                'li', { key: i },
                React.createElement(
                    'div',
                    null,
                    node.text,
                    ' ',
                    _this.isLeaf(node) ? React.createElement(
                        'span', {
                            style: { cursor: 'pointer' },
                            dangerouslySetInnerHTML: { __html: '<b>-</b>' },
                            'onClick': function onClick() {
                                return _this.removeChild(child, i);
                            }
                        },
                        '-'
                    ) : React.createElement(
                        'span', {
                            style: { cursor: 'pointer' },
                            'onClick': function onClick() {
                                return _this.addChild(node);
                            }
                        },
                        '+'
                    )
                ),
                _this.getChildItem(node)
            );
        }));
    },
    render: function() {
        return this.getChildItem(this.props.data[0]);
    }
});

var Avatar = React.createClass({
    componentWillUnmount: function() {
        console.log('Avatar componentWillUnmount');
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
                width: 50,
                height: 50,
                src: !(x % 2) ? 'http://avatar.csdn.net/6/B/7/3_q107770540.jpg' : 'http://avatar.csdn.net/6/6/D/1_yybjroam05.jpg',
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
            onClick: function(e) {
                console.log(e, 4);
            }
        }, '20160912-', null, this.props.idx, '-', x, React.createElement('input', {
            onInput: function(e) {
                console.log(e.type)
            }
        }))
    }
});

var SvgPath = React.createClass({
    render: function() {
        return 'ss';
        return React.createElement('svg', {
                width: 1200,
                height: 360,
                xmlns: "http://www.w3.org/2000/svg"
            },
            React.createElement('path', {
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
            })
        );
    }
});

var s = 10;
var x = 1;
var t = 18;
var timer = 100

var LoginLog = React.createClass({
    componentDidMount: function() {
        console.log('+?');
        var self = this;
        // setInterval  setTimeout
        setInterval(function() {
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
            self.forceUpdate();
            //console.timeEnd('update')
        }, timer);

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

        if (t > 35) {
            t = 15;
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
    React.createElement(SvgPath),
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
    '--------component return null test--------',
    '====================Tree====================='
    //React.createElement(Tree, {
    //    data: TreeStore
    //})
);

var render = React.render(vnode, document.body);

var render1 = React.render(React.createElement(A1), document.body);


window.render = render;